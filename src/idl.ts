import { RefridgeratorPoetry } from './types/refridgerator_poetry';

export const IDL: RefridgeratorPoetry = {
  "address": "Dm8gg7T8c7S6npzAy2wxswhwnbE2Zs9LyRgaKKu3Q81Y",
  "metadata": {
    "name": "refridgeratorPoetry",
    "version": "0.1.1",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closePoetryAccount",
      "discriminator": [69, 117, 206, 230, 172, 162, 197, 146],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "generatePoetry",
      "discriminator": [0, 94, 166, 171, 110, 186, 22, 47],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "poetryAccount",
      "discriminator": [41, 237, 236, 32, 153, 85, 22, 61]
    }
  ],
  "types": [
    {
      "name": "poetryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poem",
            "type": "string"
          }
        ]
      }
    }
  ]
};