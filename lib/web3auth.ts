import { type Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || ""; // 대시보드의 Client ID

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    // 필수 값만 사용하여 타입 충돌을 예방
    clientId,
    // enum 대신 문자열 리터럴 사용으로 버전별 타입 이슈 회피
    web3AuthNetwork: "sapphire_devnet",
  },
};

export default web3AuthContextConfig;