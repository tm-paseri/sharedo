---
sidebar_position: 6
---

# 6. システム構成

## 6.1 アーキテクチャ図

```mermaid
graph LR
  A[クライアント (Web/Mobile)] --> B[APIサーバー]
  B --> C[認証サーバー]
  B --> D[データベース]
  B --> E[外部サービス]
```

## 6.2 使用技術
- **フロントエンド**: React / Vue.js  
- **バックエンド**: Node.js / Python / Ruby  
- **データベース**: MySQL / PostgreSQL / MongoDB  
- **通信方式**: REST API / GraphQL