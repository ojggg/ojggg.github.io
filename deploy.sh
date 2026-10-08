#!/bin/bash

# 1. 실행 중 에러 발생 시 스크립트 즉시 중단
set -e

echo "��� 최신 코드 가져오는 중..."
git pull origin main

# 2. 변경된 파일이 있는지 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "��� 변경 사항 저장 중..."
    git add .
    
    # 현재 날짜와 시간을 커밋 메시지에 자동으로 포함 (최소한의 식별용)
    CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")
    git commit -m "Auto deploy: $CURRENT_TIME"
    
    echo "��� 원격 저장소로 업로드 중..."
    git push origin main
    echo "✅ 배포가 완료되었습니다!"
else
    echo "✨ 변경된 파일이 없어 배포를 건너넙니다."
fi
