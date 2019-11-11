const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path:'facebook_crawling/.env'});

const interaction_with_facebook = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--window-size=1920,1080',   // 브라우저 사이즈 설정
                '--disable-notifications' ]      // 알람 x
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 1080,
            height: 1080
        });
        await page.goto('https://facebook.com');

        // pupeteer 브라우저에서 마우스 보이게하는 소스
        // await page.evaluate(() => {
        //     (() => {
        //         const box = document.createElement('div');
        //         box.classList.add('mouse-helper');
        //         const styleElement = document.createElement('style');
        //         styleElement.innerHTML = `
        //   .mouse-helper {
        //     pointer-events: none;
        //     position: absolute;
        //     z-index: 100000;
        //     top: 0;
        //     left: 0;
        //     width: 20px;
        //     height: 20px;
        //     background: rgba(0,0,0,.4);
        //     border: 1px solid white;
        //     border-radius: 10px;
        //     margin-left: -10px;
        //     margin-top: -10px;
        //     transition: background .2s, border-radius .2s, border-color .2s;
        //   }
        //   .mouse-helper.button-1 {
        //     transition: none;
        //     background: rgba(0,0,0,0.9);
        //   }
        //   .mouse-helper.button-2 {
        //     transition: none;
        //     border-color: rgba(0,0,255,0.9);
        //   }
        //   .mouse-helper.button-3 {
        //     transition: none;
        //     border-radius: 4px;
        //   }
        //   .mouse-helper.button-4 {
        //     transition: none;
        //     border-color: rgba(255,0,0,0.9);
        //   }
        //   .mouse-helper.button-5 {
        //     transition: none;
        //     border-color: rgba(0,255,0,0.9);
        //   }
        //   `;
        //         document.head.appendChild(styleElement);
        //         document.body.appendChild(box);
        //         document.addEventListener('mousemove', event => {
        //             box.style.left = event.pageX + 'px';
        //             box.style.top = event.pageY + 'px';
        //             updateButtons(event.buttons);
        //         }, true);
        //         document.addEventListener('mousedown', event => {
        //             updateButtons(event.buttons);
        //             box.classList.add('button-' + event.which);
        //         }, true);
        //         document.addEventListener('mouseup', event => {
        //             updateButtons(event.buttons);
        //             box.classList.remove('button-' + event.which);
        //         }, true);
        //         function updateButtons(buttons) {
        //             for (let i = 0; i < 5; i++)
        //                 box.classList.toggle('button-' + i, !!(buttons & (1 << i)));
        //         }
        //     })();
        // });

        const id = process.env.EMAIL;
        const password = process.env.PASSWORD;

        //1. document.querySelector 를 통해 태그 접근 후 value로 값 입력
        // const raws = await page.evaluate((id, password) => {
        //     document.querySelector('#email').value = id;  // .value 로 인풋 박스에 값을 줄 수 있다.
        //     document.querySelector('#pass').value = password;
        //     document.querySelector('#loginbutton').click();
        // }, id , password);

        //2. page.type 을 통해 태그 선택 후 입력 (실제 타이핑하는 효과기 -> 실제 사람같이 행동 가능)
        await page.waitForSelector('#email');
        await page.type('#email', id);
        await page.type('#pass', password);
        await page.hover('#loginbutton');  // 로그인 버튼 위에 마우스 올리
        await page.waitFor(500);
        await page.click('#loginbutton');
            //login 됐는지 기다리는 방법 : login 이후 받게되는 응답을 찾아 기다린다.
        await page.waitForResponse((response) => {
            console.log(response, response.url());
            return response.url().includes('www.facebook.com');
        });
        await page.waitFor(3000);
        await page.keyboard.press('Escape');
            //logput
        // await page.click('#userNavigationLabel');
        await page.evaluate(() => {
            document.querySelector('#userNavigationLabel').click();
        })
        await page.waitForSelector('li.navSubmenu:last-child');
        await page.waitFor(500);
        await page.click('li.navSubmenu:last-child');
        // await page.close();
        // await browser.close();
    }catch (e) {
        console.error(e);
    }
};

interaction_with_facebook();

