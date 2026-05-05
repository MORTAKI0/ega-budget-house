const { generateKeyPairSync, randomUUID } = require("crypto");

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const kid = randomUUID();

const privatePem = privateKey.export({
  type: "pkcs8",
  format: "pem",
});

const publicJwk = publicKey.export({
  format: "jwk",
});

publicJwk.use = "sig";
publicJwk.alg = "RS256";
publicJwk.kid = kid;

const jwks = JSON.stringify({ keys: [publicJwk] });

require("fs").writeFileSync("jwt_private_key.pem", privatePem);
require("fs").writeFileSync("jwks.json", jwks);

console.log("created jwt_private_key.pem and jwks.json");
