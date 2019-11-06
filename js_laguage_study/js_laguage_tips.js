/**var, const, let 차이점*/
// var
if(true) {
    var x = 3;
}
console.log(x);  // => x = 3이 출력됨

//const, let
if(true) {
    const y = 4 ;
}
console.log(y);  // 에러 발생 , const와 let은 {} 안에서 선언되면 그 괄호를 밖에서 접근하지 못한다.
                // const : 값을 주면 이후에 변경할 수 없다.
                // let : 값을 변경할 수 있다.

//const 예외 -> object인 경우 object 종류는 못바꾸지만 object 내부 속성은 변경 가능
const z = {a: 1, b: 2, c: 3};
// z = [1,2,3];   // compile error 발생
z.a = 3; z.b = 1; z.c = 2;   // object 안에 내용은 변경 가능

/** 문자열 조합을 쉽게해주는 템플릿 문자열 : 백틱 ` */
const e = `${x} ${y} ${z}`;
console.log(e);
// x + " " + y + " " + z 와 동일함

/** 콜백 함수, Promise */
// 기존 콜백 함수
User.findOne('kyun', (err, user) => {
    if(err) {
        console.error(err);
    }
    console.log(user);
    // 추가적인 내용
});
console.log("finish");      /** 콜백 함수는 기본적으로 비동기 이기 때문에 finish가 먼저 출력되며, 한번 콜백함수를 사용하면 그 내부에 계속 추가하는 소스가 생기게 된다.*/

// Promise 사용시 : 동기 비동기를 조절할 수 있기 때문에 가독성이 오른다. (단, Promise가 처음부터 적용되는 메소드 이외에는 new Promise로 내용을 만들어 줘야 사용 가능하다.)
const User = {
    findOne() {
        return new Promise((res, rej) => {
            if('조 성공') {
                res('사용자');
            }else {
                rej('실패');
            }
        })
    }, // 추가할 함수 추
}

User.findOne('kyun')
    .then((user) => {
        console.log(user);
    }).then(/** 추가적인 내용*/)  /** .then() 을 사용하여 이후 추가적인 작업들을 붙일 수 있다.*/
    .catch((err) => {
        console.error(err);
    })