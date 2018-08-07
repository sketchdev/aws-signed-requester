# AWS Signed Requester

Simple lambda function that will make an AWS sig4 signed request to the specified URL.

It can be useful for making authenticated calls to your API gateway in response to various events.

## Creating a lambda zip file

Follow these steps to create a zip that can be uploaded to lambda.

1. remove the node_modules folder if it exists ```rm -rf node_modules```
2. install only production dependencies ```npm install --production```
3. create the zip ```./zipit.sh```

### Expected event schema

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string"
    },
    "method": {
      "type": "string"
    }
  },
  "required": [ "url" ]
}
```