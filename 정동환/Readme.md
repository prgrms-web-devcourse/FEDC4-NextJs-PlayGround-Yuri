## next.js로 blog 만드는 프로젝트에 저에게 이메일을 보내는 기능을 추가했습니다.

![Alt text](email.gif)

- nodemailer 라이브러리를 이용했습니다.
- api routing을 이용해서 node.js에서 동작하는 nodemailer를 사용할 수 있었습니다.
- fetch를 쓰다보니 네트워크 오류가 아니면 try catch에서 잡지 못하는 오류가 있었습니다. response.ok로 체크했습니다
- 입력 성공에 따라 사용자에게 알림을 보여주는 로직을 추가하려고 합니다.
- react hook form을 이용해서 form의 입력값을 관리했습니다. 아직 valdation은 추가하지 않았습니다.

[commit link](https://github.com/DongjaJ/next-blog/commit/f0ba4588a7c3a8747143adde898b606b411ac1db)
