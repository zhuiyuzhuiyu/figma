import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess, ReplaceKey, RedirectProtocol } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Runtime, Function as LambdaFunction, Code } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';

export class AdminStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiFn = new LambdaFunction(this, 'AdminApiFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      timeout: Duration.seconds(15),
      memorySize: 256,
      code: Code.fromAsset(path.resolve(__dirname, '../../backend/lambda')),
    });

    const httpApi = new HttpApi(this, 'AdminHttpApi', {
      corsPreflight: {
        allowHeaders: ['content-type'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    const apiDomainName = cdk.Fn.select(2, cdk.Fn.split('/', httpApi.url ?? ''));

    const websiteBucket = new Bucket(this, 'AdminWebsiteBucket', {
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      websiteRoutingRules: [
        {
          condition: { keyPrefixEquals: 'api/' },
          hostName: apiDomainName,
          protocol: RedirectProtocol.HTTPS,
          replaceKey: ReplaceKey.prefixWith(''),
        },
      ],
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [
        cdk.aws_apigatewayv2.HttpMethod.GET,
        cdk.aws_apigatewayv2.HttpMethod.POST,
        cdk.aws_apigatewayv2.HttpMethod.OPTIONS,
      ],
      integration: new HttpLambdaIntegration('AdminApiIntegration', apiFn),
    });

    httpApi.addRoutes({
      path: '/',
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('AdminApiRootIntegration', apiFn),
    });

    new BucketDeployment(this, 'DeployFrontendAssets', {
      destinationBucket: websiteBucket,
      sources: [Source.asset(path.resolve(__dirname, '../../build'))],
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: websiteBucket.bucketWebsiteUrl,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url ?? 'n/a',
    });
  }
}
