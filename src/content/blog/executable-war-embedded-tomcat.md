---
title: Executable WAR와 Tomcat
description: Maven이 WAR를 executable로 다시 묶고, java -jar와 외장 WAS 배포가 서로 다른 Tomcat을 쓴다.
pubDate: 2026-10-13
---

# WAR를 java -jar로 실행할 때 Tomcat

> WAR로 빌드·배포하고 `java -jar`로 단독 실행하면 내장 Tomcat을 쓴다. 같은 WAR를 외장 WAS에 올리면 그 서버의 Tomcat이 요청을 처리한다.

<br>

## 개요

애플리케이션 Java 코드에는 WAR를 다시 묶는 로직이 없다. 배포 형식은 WAR이고, Maven `package`에서 Spring Boot 플러그인이 그 파일을 executable WAR로 덮어쓴다. `java -jar`로 JVM이 직접 띄우면 내장 Tomcat이 동작한다. 외장 WAS에 WAR만 배포하는 경로도 같이 열려 있다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">WAR</span> : 웹 애플리케이션을 묶어 서버에 올리는 배포 파일.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Maven</span> : 빌드와 라이브러리 의존을 다루는 도구.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">package</span> : Maven이 배포 파일을 만드는 빌드 구간.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">executable WAR</span> : `java -jar`로 프로세스 하나를 띄울 수 있게 로더가 들어간 WAR.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">JVM</span> : Java 프로그램을 실행하는 프로세스.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">내장 Tomcat</span> : 별도 설치 없이 애플리케이션 프로세스 안에서 뜨는 Tomcat.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">외장 WAS</span> : 서버에 따로 설치해 두고, 올라온 WAR의 요청을 그 서버가 처리하는 실행 환경.</p>
</div>

<br>

## 동작 흐름

1. 패키징은 WAR다.
2. `package`에서 일반 WAR가 먼저 만들어진다.
3. 이어서 repackage가 같은 파일을 executable WAR로 덮어쓴다. 부트 로더, `Main-Class`, `WEB-INF/lib-provided`가 들어간다.
4. `java -jar`로 기동하면 로더가 애플리케이션 `main`을 부르고, 내장 Tomcat이 요청을 받는다.
5. 같은 WAR를 외장 WAS에만 올리면, repackage와 별개인 외장 진입으로 그 서버의 Tomcat이 요청을 받는다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">repackage</span> : 일반 WAR를 executable WAR로 덮어쓰는 플러그인 단계.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">부트 로더</span> : `java -jar`로 WAR를 열어 애플리케이션을 기동하는 Spring Boot 코드.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Main-Class</span> : JVM이 WAR를 `java -jar`로 열 때 가장 먼저 부르는 클래스.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">WEB-INF/lib-provided</span> : 실행 환경이 제공할 라이브러리를 WAR 안에서 따로 두는 위치.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">main</span> : `SpringApplication.run`으로 애플리케이션을 띄우는 진입 메서드.</p>
</div>

<br>

## 개념

### 부모 빌드가 repackage를 묶는다

상위는 eGovFrame Boot Starter Parent 5.0.0이고, 그 안은 Spring Boot 3.5.6 부모를 상속한다. 그 부모 POM이 `spring-boot-maven-plugin`의 repackage를 `package`에 기본으로 묶어 둔다. 이 빌드에는 `executions`를 따로 적지 않고, 그 기본값만 쓴다. 플러그인 설정은 `spring-boot-devtools`를 빼고, 리소스 추가는 켜 둔다.

repackage 구현은 애플리케이션 소스가 아니다. Maven이 받은 플러그인과 로더 도구 안에 있다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">부모 POM</span> : 이 빌드가 목표와 기본값을 물려받는 상위 빌드 정의.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">executions</span> : 플러그인 목표를 어느 빌드 구간에 실행할지 적는 설정. 여기에는 없고, 부모가 package에 repackage를 이미 묶어 두었다.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">spring-boot-maven-plugin</span> : package 구간에서 WAR를 executable로 다시 묶는 Spring Boot 빌드 확장.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">spring-boot-devtools</span> : 개발 중에만 쓰는 도구. 배포물에서는 빠진다.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">로더 도구</span> : executable WAR를 기동하는 코드가 들어 있는 Spring Boot 라이브러리.</p>
</div>

<br>

### 단독 실행은 main을 매니페스트에 연결한다

`main`은 `SpringApplication.run`으로 이 애플리케이션을 띄운다. executable WAR는 그 클래스를 매니페스트의 `Start-Class`로 적는다. `Main-Class`는 `org.springframework.boot.loader.launch.WarLauncher`이거나 그와 같은 계열의 로더다. 로더가 `Start-Class`의 `main`을 호출해 단독 프로세스로 기동한다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">매니페스트</span> : WAR 안에 진입 클래스를 적어 둔 목록.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Start-Class</span> : 로더 다음에 호출되는 애플리케이션 클래스.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">WarLauncher</span> : executable WAR를 열어 애플리케이션 `main`을 호출하는 Spring Boot 로더.</p>
</div>

<br>

### 외장 배포는 초기화 클래스로 들어간다

외장 WAS용 클래스는 `SpringBootServletInitializer`를 상속하고, 애플리케이션 클래스를 소스로 등록한다. WAR만 외장 서버에 올릴 때의 진입점이고, repackage 코드가 있는 위치와는 무관하다.

`spring-boot-starter-web`의 기본 엔진은 내장 Tomcat이다. 외장으로 갈 때는 `spring-boot-starter-tomcat`을 provided로 두어, 내장 Tomcat 라이브러리를 WAR에 넣지 않는다. Tomcat, LENA, Jeus에 배포하면 그 WAS에 설치된 Tomcat이 요청을 처리한다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">SpringBootServletInitializer</span> : 외장 서버가 WAR를 기동할 때 애플리케이션을 등록하는 기반 클래스.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">spring-boot-starter-web</span> : 웹 구성에 필요한 기본 의존. 기본 엔진은 내장 Tomcat이다.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">provided</span> : 컴파일에는 쓰이고 WAR에는 넣지 않는 의존 범위. 실행 환경이 그 라이브러리를 제공한다.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">LENA</span> : WAR를 올려 실행하는 외장 서버 제품.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Jeus</span> : WAR를 올려 실행하는 외장 서버 제품.</p>
</div>

<br>

### 띄우는 방법이 Tomcat을 고른다

| 실행 | Tomcat |
| --- | --- |
| `mvn spring-boot:run`, `java -jar` | 내장. Boot가 가져온 버전 |
| WAR를 외장 Tomcat 등에 배포 | 외장. 서버에 설치된 버전 |
| Spring Boot 3, WAR, provided Tomcat | 둘 다 가능. 어떻게 띄우는지에 따라 갈림 |

개발 서버는 `java -jar`이므로 내장 Tomcat이다. 운영에서 LENA나 외장 Tomcat에 WAR만 올리는 구조는 외장 Tomcat이고, 내장은 쓰지 않는다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">spring-boot:run</span> : Maven이 애플리케이션을 바로 띄우는 실행. 이때도 내장 Tomcat이다.</p>
</div>

<br>

### 신규 구성에서는 내장이 흔하다

Spring Boot만 새로 쓰는 경우, 보통은 내장 Tomcat이나 Jetty, Undertow로 `java -jar` 또는 컨테이너 실행을 한다.

로컬은 거의 `spring-boot:run`이나 `java -jar`다. AWS, Docker, Kubernetes, 작은 가상 머신은 프로세스 하나에 `java -jar`이고, 운영체제에 Tomcat을 따로 깔지 않는다. 마이크로서비스나 신규 서비스도 내장이 표준에 가깝다.

외장 Tomcat이나 WAS에 WAR를 배포하는 쪽은, 조직에 이미 그 운영이 있을 때 남는다. Tomcat, LENA, Jeus, WebLogic 체계, 한 WAS에 여러 앱, 보안·패치·로그를 WAS 단위로 맞추는 정책, 공공 표준 WAS 요구가 그런 경우다.

이 구성의 WAR, provided Tomcat, 서블릿 초기화 클래스는 운영에서 외장 WAS도 가능하게 둔 이중 대비다. 개발을 `java -jar` 내장으로 두는 것은 흔하다.

신규와 클라우드에서는 내장이 기본이다. 레거시, 공공, WAS 중심 운영에서는 외장도 여전히 많다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Jetty</span> : 내장으로 고를 수 있는 또 다른 서블릿 엔진.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Undertow</span> : 내장으로 고를 수 있는 또 다른 서블릿 엔진.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">컨테이너</span> : 애플리케이션과 실행 환경을 하나로 묶어 띄우는 단위.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">Kubernetes</span> : 컨테이너로 애플리케이션을 여러 머신에서 돌리는 환경.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">마이크로서비스</span> : 기능을 작은 프로세스로 나누어 각각 띄우는 구성.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">WebLogic</span> : WAR를 올려 실행하는 외장 서버 제품.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">서블릿 초기화 클래스</span> : 외장 WAS가 WAR를 기동할 때 애플리케이션을 등록하는 클래스.</p>
</div>

<br>

## 사용 방법

부모로부터 온 바인딩은 최종 빌드 설정에서 플러그인과 repackage를 확인한다.

```
mvn help:effective-pom -Doutput=/tmp/effective-pom.xml
```

패키지 로그에서 repackage 실행도 본다.

```
mvn package -X
```

배포된 WAR 매니페스트에 `Main-Class`가 `WarLauncher`(또는 유사 로더)이고 `Start-Class`가 애플리케이션 클래스이면, repackage된 executable WAR다.

```
unzip -p {배포경로}/애플리케이션.war META-INF/MANIFEST.MF
```

기동은 다음이다. 파일 형식은 WAR이고, JAR처럼 `java -jar`로 실행한다.

```
java -jar {배포경로}/애플리케이션.war
```

이 실행을 한 줄로 말하면, WAR로 빌드·배포하고 `java -jar`로 단독 실행하여 Spring Boot 내장 Tomcat을 사용한다. 짧게는 executable WAR를 `java -jar`로 기동해 내장 Tomcat 10.1.46을 쓴다.

<div style="margin:1.35rem 0 1.75rem;padding:0.1rem 0 0.15rem 0.9rem;border-left:2px solid var(--color-strong,#1c1917);">
<p style="margin:0 0 0.45rem;font-weight:650;letter-spacing:-0.015em;color:var(--color-strong,#1c1917);">keyword</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">JAR</span> : Java 프로그램을 묶어 `java -jar`로 실행하는 배포 형식. 이 배포 파일의 형식은 WAR다.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">effective-pom</span> : 상속과 기본값을 모두 펼친 최종 빌드 설정.</p>
<p style="margin:0.12rem 0;line-height:1.65;color:var(--color-ink,#44403c);"><span style="font-weight:650;color:var(--color-strong,#1c1917);">{배포경로}</span> : 서버에 WAR 파일을 둔 위치.</p>
</div>

<br>

## 정리

배포 파일은 WAR다. 서버에 그 파일을 두고 `java -jar`로 JVM이 직접 실행한다. 그 실행이 Spring Boot 내장 Tomcat을 쓴다.

Spring Boot가 외장 Tomcat을 막지는 않는다. 기본은 내장이고, WAR와 provided, 서블릿 초기화 클래스가 있으면 외장도 가능한 조합이다.
