---
title: "Sagemaker Aurora Postgres Terraform"
date: 2022-03-03T18:16:54-05:00
draft: false
categories: ['Tech']
tags: ['Sagemaker', 'Terraform', 'Aurora', 'Postgres', 'ML']
---

This post will outline a minimal end to end sagemaker setup using terraform. This setup includes setting up the sagemaker domain, notebook instance, endpoint, and all the associated roles and policies. At the end of this post you should have a trained sagemaker model deployed that can be accessed through an aurora postgres stored procedure call. How cool is that.

<!--more-->

### Outline
1. [Setup sagemaker domain](#setup-the-sagemaker-domain)
2. [Setup sagemaker notebook instance](#setup-the-sagemaker-notebook-instance)
3. [Notebook instance IAM Roles and Policies](#notebook-instance-iam-roles-and-policies)
4. [Aurora Postgres IAM Roles and Policies](#aurora-postgres-iam-roles-and-policies)


### Setup the sagemaker domain

> An Amazon SageMaker Domain consists of an associated Amazon Elastic File System (Amazon EFS) volume; a list of authorized users; and a variety of security, application, policy, and Amazon Virtual Private Cloud (Amazon VPC) configurations.

The domain setup was actually fairly straight forward. All of the fields listed below are required. I prefixed mosted of the role, policy, and resource names with `ex` for `example`. In the below snippet you can chose you're own domain_name and the vpc_id and subnet_ids will need to be specific to your setup. You can also pick the execution rule but it will need to match what we do later in the roles section.

```hcl
resource "aws_sagemaker_domain" "ex-sagemaker" {
  domain_name = "ex-sagemaker"
  auth_mode   = "IAM"
  vpc_id      = module.base.vpc_id
  subnet_ids  = module.base.private_subnets

  default_user_settings {
    execution_role = aws_iam_role.ex-sagemaker.arn
  }
}
```

### Setup the sagemaker notebook instance

The notebook instance is a server that will run jupyter notebooks for you. I also have listed a github repo that will be the directory where the notebook spins up. The repo part is optional, feel free to leave off the first resource block and the default_code_repository in the second block. Again you can chose any name, the role_arn must match the role used in the domain. The security groups need to have a security group that can hit postgres for the later steps. The direct internet access can be enabled if you do not have a NAT for your VPC.

```hcl

resource "aws_sagemaker_code_repository" "ex-sagemaker-data-analytics-repo" {
  code_repository_name = "data-analytics"

  git_config {
    repository_url = "https://github.com/my-repositories/data-analytics.git"
    secret_arn = "arn:aws:secretsmanager:us-east-1:996471257056:secret:AmazonSageMaker-example-system-gh-user-gyCE67"
  }
}

resource "aws_sagemaker_notebook_instance" "ex-notebook-instance-bp" {
  name                    = "ex-notebook-instance"
  role_arn                = aws_iam_role.ex-sagemaker.arn
  instance_type           = "ml.c5.xlarge"
  default_code_repository = aws_sagemaker_code_repository.ex-sagemaker-data-analytics-repo.code_repository_name
  platform_identifier     = "notebook-al2-v1"
  security_groups         = [module.security-group-with-access-to-aurora-postgres.security_group_id]
  subnet_id               = element(module.base.private_subnets, 0)
  direct_internet_access  = "Disabled"
  volume_size             = 100
}
```

### Notebook instance IAM Roles and Policies

First create a policy that gives the sagemaker service assume role.

```hcl
data "aws_iam_policy_document" "sagemaker_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["sagemaker.amazonaws.com"]
    }
  }
}
```

Then create the iam role and attach the assume role policy. This role name must match what you've used in the steps above.

```hcl
resource "aws_iam_role" "ex-sagemaker" {
  name               = "ex-sagemaker"
  assume_role_policy = data.aws_iam_policy_document.sagemaker_assume_role_policy.json
}
```

Additionally we'll need to attach the AmazonSageMakerFullAccess policy to the role

```hcl
resource "aws_iam_role_policy_attachment" "sagemaker_full_access" {
  role       = aws_iam_role.ex-sagemaker.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}
```

That takes care of the basics for what you'd need to run the notebook instance, train models, deploy endpoints etc.

### Aurora Postgres IAM Roles and Policies
The following is needed to access the deployed endpoint from aurora postgres.

First create a new IAM role  with assumeRole capabilities.

```hcl
resource "aws_iam_role" "ex-aurora-sagemaker" {
  name = "ex-aurora-sagemaker"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "rds.amazonaws.com"
      }
    }
  ]
}
EOF
}
```

Create a IAM policy that gives the role we just create the ability to invoke sagemaker endpoints.

#### Note: region and account number were required to be hardcoded in the resource arn!

This is a pain when trying to make reusable terraform but I couldn't find a workaround. Swap us-east-1 and  996471257056 for your region and account number.

```hcl
resource "aws_iam_policy" "aurora_sagemaker_endpoint_policy" {
  name        = "aurora_sagemaker_endpoint_policy"
  description = "Allows us to run sagemaker models from the database"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
  {
      "Sid": "AllowAuroraToInvokeRCFEndPoint",
      "Effect": "Allow",
      "Action": [
          "sagemaker:InvokeEndpoint"
     ],
      "Resource": [
        "arn:aws:sagemaker:us-east-1:996471257056:endpoint/*"
      ]
    }
  ]
}
EOF
}
```

Attach the invoke endpoint policy to the role we created.

```hcl
resource "aws_iam_role_policy_attachment" "ex-aurora-sagemaker-at-pol" {
  role       = aws_iam_role.ex-aurora-sagemaker.name
  policy_arn = aws_iam_policy.aurora_sagemaker_endpoint_policy.arn
}
```

Associate the role we created with the db cluster.

```hcl
data "aws_rds_cluster" "ex-prd-analytics" {
  cluster_identifier = "ex-prd-analytics"
}

resource "aws_rds_cluster_role_association" "ex-rds-cluster-sagemaker-assoc" {
  db_cluster_identifier = data.aws_rds_cluster.ex-prd-analytics.id
  feature_name          = "SageMaker"
  role_arn              = aws_iam_role.ex-aurora-sagemaker.arn
}
###
```

That should get you bootstrapped to start training and deploying models from the notebook instance and running inference from the aurora postgres `aws_ml` extension.
Check out [https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-ml.html](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-ml.html) for more details on the actual training and calling of the endpoint.

One thing to note, the stored procedure `aws_sagemaker.invoke_endpoint` can be called in two ways. Both ways the first two arguments are endpoint name and batch size. Then the third argument can either be an array of each feature or you can specify each feature as arguments 3...n_features but be wary of the 100 parameter limit in postgres.
