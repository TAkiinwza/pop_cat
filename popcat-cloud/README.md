# Popcat-Cloud
เว็บ Popcat พร้อม backend และ Redis รองรับ autoscaling บน Kubernetes พร้อม CI/CD และสคริปต์ k6

## Architecture
```mermaid
flowchart LR
  U[Users] -->|HTTPS| I[Ingress NGINX]
  I --> F[Frontend (Nginx static)]
  I --> B[Backend (Express)]
  B --> R[(Redis)]
```

- Frontend: React build เป็นไฟล์ static เสิร์ฟด้วย Nginx
- Backend: Node.js Express จัดการ endpoint `/api/click` และ `/api/stats`
- Redis: เก็บยอดคลิกต่อประเทศผ่าน Sorted Set + เก็บ total
- HPA: autoscale ทั้ง frontend/backedn ตาม CPU

## Deploy
1. เติม host จริงใน `k8s/frontend.yaml` ที่ Ingress
2. ตั้ง repo secrets: `KUBE_CONFIG_DATA` (base64 kubeconfig)
3. push ไป branch `main` เพื่อให้ Actions ทำงานอัตโนมัติ

## Load test
```bash
k6 run -e BASE=https://YOURHOST k6/load.js
kubectl -n popcat get hpa -w
kubectl top pods
```

## Screenshot/Report ที่ต้องแนบ
- หน้าเว็บพร้อมยอดรวมและตารางอันดับ
- หน้าจอ GitHub Actions สำเร็จ
- ผล k6 (p95 latency/req per sec)
- กราฟ HPA แสดงจำนวน replicas เพิ่ม/ลด
