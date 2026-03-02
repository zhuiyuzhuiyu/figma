#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AdminStack } from '../lib/admin-stack';

const app = new cdk.App();

new AdminStack(app, 'SimpleAdminStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'ap-southeast-1',
  },
});
