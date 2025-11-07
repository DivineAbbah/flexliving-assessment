```mermaid
flowchart TD
    %% Global Layer
    USERS[Users Global Access]
    CLOUDFRONT[CloudFront CDN + WAF]
    ROUTE53[Route53 DNS<br>Geolocation Routing]
    
    %% US Region
    subgraph US_REGION[US-East-1 Region]
        subgraph US_EKS[EKS Cluster - US]
            US_API[API Pods<br>PHP Monolith]
            US_VIDEO[Video Processing<br>Microservice]
            US_ANALYTICS[Analytics<br>Microservice]
        end
        
        subgraph US_DB[Aurora PostgreSQL - US]
            US_DB_MASTER[Master<br>Multi-AZ]
            US_DB_REPLICA1[Replica AZ1]
            US_DB_REPLICA2[Replica AZ2]
        end
        
        subgraph US_STORAGE[S3 Storage - US]
            US_UPLOADS[Uploads Bucket]
            US_PROCESSED[Processed Videos]
            US_STATIC[Static Assets]
        end
        
        US_ALB[Application<br>Load Balancer]
        US_CACHE[ElastiCache<br>Redis Cluster]
    end
    
    %% Saudi Region
    subgraph SAUDI_REGION[ME-Central-1 Region]
        subgraph SAUDI_EKS[EKS Cluster - Saudi]
            SAUDI_API[API Pods<br>PHP Monolith]
            SAUDI_VIDEO[Video Processing<br>Microservice]
            SAUDI_ANALYTICS[Analytics<br>Microservice]
        end
        
        subgraph SAUDI_DB[Aurora PostgreSQL - Saudi]
            SAUDI_DB_MASTER[Master<br>Multi-AZ]
            SAUDI_DB_REPLICA1[Replica AZ1]
            SAUDI_DB_REPLICA2[Replica AZ2]
        end
        
        subgraph SAUDI_STORAGE[S3 Storage - Saudi]
            SAUDI_UPLOADS[Uploads Bucket]
            SAUDI_PROCESSED[Processed Videos]
            SAUDI_STATIC[Static Assets]
        end
        
        SAUDI_ALB[Application<br>Load Balancer]
        SAUDI_CACHE[ElastiCache<br>Redis Cluster]
    end
    
    %% Global Services
    subgraph GLOBAL_SERVICES[Global Management Services]
        MONITORING[Monitoring<br>Prometheus + Grafana<br>CloudWatch]
        SECURITY[Security<br>GuardDuty + Config<br>Security Hub]
        CICD[CI/CD<br>GitHub Actions<br>ArgoCD]
        IAM[IAM & Secrets<br>Secrets Manager<br>KMS]
    end
    
    %% Data Flow
    USERS --> ROUTE53
    ROUTE53 --> CLOUDFRONT
    
    CLOUDFRONT --> |US Traffic| US_ALB
    CLOUDFRONT --> |Saudi Traffic| SAUDI_ALB
    
    %% US Data Flow
    US_ALB --> US_EKS
    US_API --> US_DB
    US_API --> US_CACHE
    US_VIDEO --> US_STORAGE
    US_ANALYTICS --> US_DB
    
    %% Saudi Data Flow
    SAUDI_ALB --> SAUDI_EKS
    SAUDI_API --> SAUDI_DB
    SAUDI_API --> SAUDI_CACHE
    SAUDI_VIDEO --> SAUDI_STORAGE
    SAUDI_ANALYTICS --> SAUDI_DB
    
    %% Global Connections
    GLOBAL_SERVICES --> US_REGION
    GLOBAL_SERVICES --> SAUDI_REGION
    
    %% Cross-Region Replication
    US_STORAGE -.->|Cross-Region<br>Replication| SAUDI_STORAGE
    SAUDI_STORAGE -.->|Cross-Region<br>Replication| US_STORAGE
    
    %% Database Global Cluster
    US_DB -.->|Global Database<br>Read Replicas| SAUDI_DB
    SAUDI_DB -.->|Global Database<br>Read Replicas| US_DB
    
    %% Styling
    classDef region fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef global fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#1b5e20,stroke-width:1px
    classDef storage fill:#fff3e0,stroke:#e65100,stroke-width:1px
    classDef database fill:#fce4ec,stroke:#880e4f,stroke-width:1px
    
    class US_REGION,SAUDI_REGION region
    class GLOBAL_SERVICES,CLOUDFRONT,ROUTE53 global
    class US_EKS,SAUDI_EKS,US_ALB,SAUDI_ALB service
    class US_STORAGE,SAUDI_STORAGE storage
    class US_DB,SAUDI_DB,US_CACHE,SAUDI_CACHE database
