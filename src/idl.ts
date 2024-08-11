import { CryptoPoetry } from './types/crypto_poetry';

export const IDL: CryptoPoetry = {
  "address": "6cesC5Z7g527BeuDpDKyzP7rjgn17HfKEshspHXYFaUL",
  "metadata": {
    "name": "cryptoPoetry",
    "version": "0.1.1",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closePoetryAccount",
      "discriminator": [
        69,
        117,
        206,
        230,
        172,
        162,
        197,
        146
      ],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "poetryAccount"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "generatePoetry",
      "discriminator": [
        0,
        94,
        166,
        171,
        110,
        186,
        22,
        47
      ],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "poetryAccount"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
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
    },
    {
      "name": "lockPoetryAccount",
      "discriminator": [
        33,
        234,
        93,
        241,
        172,
        15,
        40,
        166
      ],
      "accounts": [
        {
          "name": "poetryAccount",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "poetryAccount"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "poetryAccount",
      "discriminator": [
        41,
        237,
        236,
        32,
        153,
        85,
        22,
        61
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "accountLocked",
      "msg": "This account is locked and cannot generate new poems"
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
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
