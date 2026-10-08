---
title: OS를 HDD에서 SSD로 옮기기
description: 재설치 없이 HDD의 Ubuntu를 SSD로 복사하고, 다음 부팅을 SSD에 맞추는 절차.
pubDate: 2026-10-07
---

# OS를 HDD에서 SSD로 옮기기

> 서비스를 멈춘 뒤 HDD 내용을 SSD로 복사하고, HDD는 돌아올 디스크로 남긴다.

<br>

## 개요

{툴서버}는 Ubuntu 26.04를 HDD에서 돌린다. 패키지, 설정, 컨테이너 데이터, 빌드 데이터는 그 디스크에 있다. SSD에는 예전 Ubuntu 24.04만 남아 있고, 지금은 붙어 있지 않다. 부팅은 UEFI이고 보안 부팅은 꺼져 있다. 호스트 이름이 {툴서버}가 아니면 작업은 바로 끝난다.

재설치 없이 HDD 내용을 SSD로 복사한 뒤 SSD로 켜지게 바꾼다. 지워지는 것은 SSD 안의 예전 시스템뿐이다. HDD 파일은 지우지 않는다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">HDD</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">원판이 돌아가며 데이터를 담는 디스크.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">SSD</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">원판 없이 데이터를 담는 디스크.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">UEFI</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">전원을 켠 직후, 어떤 디스크로 켤지 고르는 방식.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">보안 부팅</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">부팅 파일이 서명되었는지 확인하는 기능. 이 서버에서는 꺼져 있다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">컨테이너</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">저장소, 이슈 추적, 코드 품질, 위키처럼 서비스를 나눠 띄우는 실행 상자.</span></p>
</div>

<br>

## 동작 흐름

1. 접속이 끊겨도 작업이 남도록 세션을 연다.
2. 읽기만 하며 확인한다. 대상이 {툴서버}인지, 지금 켜진 디스크가 HDD인지, SSD가 붙어 있지 않은지, 사용량이 SSD 루트의 90% 미만인지를 본다. 여기서 멈춰도 디스크는 바뀌지 않는다.
3. 서비스를 멈추고, 떠 있던 컨테이너와 예약 작업의 목록을 남긴다. 패키지를 설치하거나 갱신하는 중이면 아무것도 멈추지 않고 거부한다.
4. SSD의 파일시스템만 새로 만든 뒤 HDD 전체를 복사하고 비교한다. 다른 파일이 있으면 한 번 더 복사한다. 실패하면 30초 뒤 최대 세 번 다시 시도하고, 이미 복사된 파일은 건너뛴다.
5. 재부팅 없이 이어서 SSD 쪽 부팅 정보만 맞추고, 다음 한 번만 SSD로 켜지게 예약한다. 평소 순서는 HDD 그대로다.
6. USB를 빼고 재부팅한다.
7. 세션을 다시 열고 서비스를 켠다. 이미 떠 있는 컨테이너는 건너뛴다.
8. SSD로 떴는지와 데이터를 확인한다. 실패하면 평소 부팅은 바꾸지 않는다. 통과한 뒤에만 SSD를 기본으로 고정할지 묻는다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">세션</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">접속이 끊겨도 서버에서 작업을 이어서 두는 화면.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">파일시스템</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">디스크 구역을 파일로 쓸 수 있게 만드는 형식.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">기본 부팅</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">메뉴에서 고르지 않아도 전원을 켤 때 먼저 선택되는 디스크.</span></p>
</div>

<br>

## 개념

### 모델로 디스크 고르기

장치 이름 순서가 아니라 모델명과 회전 여부로 HDD와 SSD를 하나씩 찾는다. 지금 켜진 디스크가 {HDD모델}일 때만 복사와 부팅 설정을 한다. SSD가 이미 켜진 디스크이거나, SSD 첫 구역의 식별자가 예상과 다르면 중단한다. 복사와 부팅에 필요한 명령이 없어도 확인 단계에서 멈춘다. 디스크 상태 점검이 가능하면 통과일 때만 진행한다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">모델명</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">디스크 제품 이름. 연결 순서가 바뀌어도 같은 디스크를 찾는다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">회전 여부</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">원판이 도는 디스크인지. 돌지 않으면 SSD, 돌면 HDD로 본다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">식별자</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">디스크 구역을 구분하는 번호. 예상과 다르면 다른 디스크로 보고 멈춘다.</span></p>
</div>

<br>

### 멈춘 뒤에만 복사

멈추는 순서는 목록 밖의 컨테이너, 위키, 이슈 추적 두 곳, 코드 품질, 저장소 순이다. 저장소는 더 오래 기다린다. 그다음 빌드, 예약 작업, 컨테이너를 띄우는 프로그램을 끈다. 데이터 파일은 지우지 않는다. 빌드는 시스템 서비스가 아니므로 프로세스를 직접 끝내고, 60초 안에 안 내려가면 강제로 끊는다.

복사는 그 프로그램과 빌드, 패키지 작업이 모두 멈춘 뒤에만 시작한다. 전체 복사, 마무리 복사, 비교 순이다. 원본에 없는 파일은 SSD에서만 지운다. HDD는 지우지 않는다.

복사에서 빼는 곳은 실행 중에만 있는 자리, 다른 디스크를 붙이는 자리, 새 파일시스템이 직접 만드는 자리, 사용 중인 예비 메모리 파일, HDD 부팅 구역, 보관용 부팅 목록이다. 이미 새 파일시스템이면 비우지 않고 이어서 복사한다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">예약 작업</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">정해진 시각이나 주기로 파일을 건드릴 수 있는 일. 복사 중에는 끄고, 서비스를 켤 때 다시 켠다. 빌드를 다시 띄우는 예약도 여기 포함된다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">맞추기</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">원본에 없는 파일을 복사 대상에서 지워 양쪽을 같게 하는 일. 지우는 쪽은 SSD다.</span></p>
</div>

<br>

### SSD만 새로 만들기

SSD에 예전 24.04가 있으면 대상 디스크를 보여 주고 `초기화`를 입력해야 파일시스템을 새로 만든다. 나눈 구역의 표는 유지해서, 펌웨어에 있는 SSD 부팅 항목이 그대로 유효하다. 대상이 지금 켜진 디스크이면 만들지 않고 중단한다. 새 파일시스템이 이미 있으면 이 단계는 건너뛴다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">초기화</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">SSD만 비우고 파일시스템을 다시 만들겠다는 확인 입력. 다른 글자를 넣으면 아무것도 바꾸지 않고 멈춘다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">펌웨어</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">운영체제보다 먼저 실행되어, 어떤 디스크로 켤지 고르는 프로그램.</span></p>
</div>

<br>

### 같은 부팅 안에서 부팅 맞추기

부팅 설정은 같은 부팅 안에서 복사가 끝났고, 그 뒤 SSD가 바뀌지 않았을 때만 진행한다. 중간에 재부팅했으면 정지부터 다시 하고, 복사는 바뀐 파일만 옮긴다. 바꾸는 곳은 SSD 복사본뿐이다. 켜져 있는 HDD의 부팅 목록은 그대로 둔다.

SSD 안에는 기존 목록의 보관본, SSD 식별자로 다시 쓴 목록, 8GB 예비 메모리 파일, 5초 동안 보이는 부팅 메뉴를 둔다. 부팅 프로그램은 SSD 첫 구역에 설치하되 펌웨어의 평소 순서는 바꾸지 않는다. 설치 뒤에는 부팅 파일이 SSD를 가리키는지, 커널이 SSD로 켜지는지, 기본 커널의 초기 파일이 있는지를 확인한다. 펌웨어에 SSD 항목이 없으면 만들고, 다음 한 번만 SSD로 예약한다. 예약이 들어갔는지는 다시 읽어 확인한다.

SSD로 켜지다 멈추면 전원을 껐다 켠다. 평소 순서가 HDD이므로 HDD로 돌아온다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">부팅 목록</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">켤 때 어떤 디스크를 어디에 붙일지 적어 둔 파일.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">예비 메모리 파일</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">메모리가 부족할 때 디스크를 메모리처럼 쓰는 파일. SSD에는 8GB를 새로 만든다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">커널</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">운영체제의 핵심. 이 서버는 재부팅하면 기본 커널이 7.0.0-30에서 7.0.0-34로 바뀔 수 있다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">다음 한 번</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">바로 다음 부팅에만 지정한 디스크로 켜지고, 그 뒤에는 평소 순서로 돌아가는 예약.</span></p>
</div>

<br>

### 확인한 뒤에만 고정

확인은 호스트 이름, Ubuntu 26.04, 커널, 루트와 부팅 구역이 SSD인지, HDD 루트가 붙어 있지 않은지, 예비 메모리, 부팅 목록, 데이터 여섯 곳, 컨테이너 다섯 개, 서비스 포트, HDD를 읽기만 붙여 본 사용량과 파일 수를 본다. 사용량과 파일 수는 5% 안이어야 한다. 저장소 컨테이너는 정상 표시일 때만 통과한다.

하나라도 실패하면 기본 부팅은 바꾸지 않는다. 통과한 뒤 화면까지 확인했을 때만 SSD를 앞으로 둘지 묻는다. 고정은 SSD로 켜진 상태에서만 되고, 순서는 SSD 다음 HDD다. 고정하지 않으면 다음 재부팅은 HDD다.

서비스를 다시 켤 때는 저장소가 정상 표시가 될 때까지 최대 10분 기다린다. 빌드는 {계정정보}로 기동 스크립트를 실행한다. 로그는 실행할 때마다 새로 쓰므로, 시작 전에 이전 로그를 남긴다. 재부팅 직후 컨테이너는 이미 떠 있을 수 있어, 떠 있는 것은 건너뛴다. HDD로 켜진 상태에서 SSD 다음 부팅 예약이 남아 있으면 그 예약을 취소한다. 예약을 둔 채 HDD에서 서비스를 켜면 SSD 복사본이 오래된 상태가 되기 때문이다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">정상 표시</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">저장소 컨테이너가 준비되었다고 스스로 알리는 상태. 이 표시 전에는 확인을 통과하지 않는다.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">기동 스크립트</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">빌드를 시스템 서비스 대신 계정으로 직접 띄우는 명령. 로그를 매번 새로 쓴다.</span></p>
</div>

<br>

## 사용 방법

관리자 권한으로, 세션 안에서, 확인부터 검증까지 한 순서로 간다. 확인과 상태 조회는 서비스를 멈추지 않는다. 복사와 부팅 설정은 세션 밖에서 하면 한 번 더 묻고, 그때 진행해도 된다고 답하면 계속한다. 서버 앞 화면에서 직접 할 때만 세션을 생략할 수 있다. 결과의 실패 표시가 없어야 다음으로 간다. 끝난 기준은 확인 기록의 통과다.

```bash
ssh {계정정보}@{내부IP}
tmux new -s ssd
```

작업 파일은 {작업디렉터리}에 둔다. 접속이 끊기면 다시 들어와 같은 세션에 붙는다. 세션 이름이 이미 있으면 새로 만들지 않고 붙는다. 재부팅하면 세션이 사라지므로 다시 만든다.

<div style="margin:1.75rem 0 2rem;padding:0.15rem 0;background:#fafaf9;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
<p style="margin:0.85rem 0 0.15rem;font-size:11px;letter-spacing:0.18em;font-weight:650;color:#1f7a5c;">이 말의 뜻</p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">관리자 권한</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">디스크를 바꾸고 부팅 순서를 고칠 수 있는 권한.</span></p>
<p style="margin:0;padding:0.72rem 0;border-top:1px solid #e7e5e4;"><span style="display:block;font-weight:650;letter-spacing:-0.015em;color:#1c1917;">tmux</span><span style="display:block;margin-top:0.18rem;color:#57534e;line-height:1.65;">세션을 만들고 다시 붙는 프로그램. 서버에는 이미 설치되어 있다.</span></p>
</div>

<br>

## 주의·제한

- 비우기와 맞추기의 대상은 SSD뿐이다. HDD는 롤백용으로 남긴다. SSD 운영이 확인된 뒤에만 HDD를 따로 정리한다.
- HDD 연결이 불안정하면 복사 중 읽기 오류가 날 수 있다. 복사는 최대 세 번 다시 시도하고, 그동안 늘어난 연결 오류 수를 기록한다.
- 재부팅하면 기본 커널이 7.0.0-34로 바뀔 수 있다. 메뉴는 5초 보인다. 그 커널로 켜지지 않으면 7.0.0-30을 고른다. 그때는 한 번 예약이 이미 쓰였을 수 있어, 펌웨어 메뉴에서 SSD를 직접 고른다.
- 복사와 부팅 설정은 같은 부팅 안에서 이어서 한다. 그 사이에 재부팅하거나 서비스를 켜면 부팅 설정은 거부한다.
- 재부팅 전에 USB를 뺀다. 꽂혀 있으면 USB로 켜질 수 있다.
- 마운트가 없는지 볼 때, 결과가 없어도 명령이 성공으로 끝날 수 있다. 종료 코드가 아니라 출력이 있는지로 판단한다.
- 복사 전에 멈추면 서비스만 다시 켠다. 복사 중에 멈추면 서비스만 다시 켜고, SSD는 아직 쓰이지 않으므로 둬도 된다.
- 부팅 설정 후 재부팅 전이면 다음 예약을 취소하고 서비스를 켠다. SSD 부팅이 멈추면 전원을 껐다 켜고, HDD로 오면 서비스를 켠다.
- SSD로 떴지만 고정 전이면 재부팅만 해도 평소 순서인 HDD로 돌아온다. 고정까지 한 뒤라면 다음 한 번만 HDD로 예약하고 재부팅한다. 서버 앞에서는 펌웨어 메뉴에서 HDD를 고른다.
- HDD로 돌아오면 복사 직전 상태다. SSD에서 바꾼 데이터는 HDD에 없다. 다시 하려면 정지, 복사, 부팅 설정부터 하고, 두 번째 복사는 바뀐 파일만 옮긴다.
