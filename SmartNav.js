/**
 * Version: 1.0.0
 * Web: https://fe-jw.github.io/SmartNav
 * GitHub: https://github.com/FE-jw/SmartNav
 * Released: ####-##-##
*/

class SmartNav{
	constructor(selector, options){
		this.wrapper = selector;
		this.navBtns = document.querySelector(selector).querySelectorAll('a[href^="#"]');

		this.activeClass = options?.activeClass;
		this.duration = options?.duration ?? 500;
		this.easing = options?.easing ?? 'ease';
		this.helmet = this.setHelmet(options?.helmet);
		this.iosNotch = options?.iosNotch ? this.notchValue : 0;
		this.transOffset = this.setTransOffset(options?.transOffset);

		this.init(options);
	}

	/**
	 * iOS notch 값 조회
	 */
	get notchValue(){
		const tempEle = document.createElement('div');
		tempEle.setAttribute('style', 'top:constant(safe-area-inset-top);top:env(safe-area-inset-top)');
		const value = Number(window.getComputedStyle(tempEle).top.replace('px', ''));

		return value;
	}

	/**
	 * 이동할 영역들의 ID 값 조회
	 */
	get targetHash(){
		const hashArr = [];

		this.navBtns.forEach(navBtn => {
			const id = navBtn.hash.replace('#', '');
			hashArr.push(id);
		});

		return hashArr;
	}

	/**
	 * 헤더, 네비 높이 값만큼 간격 적용
	 * @param {object} helmet - offsetHeight를 반환할 HTML 요소
	 * @returns {number}
	 */
	setHelmet(helmet){
		if(helmet ?? typeof helmet == 'object'){
			const value = helmet.offsetHeight;
			this.helmet = value;
			return value;
		}else{
			this.helmet = 0;
			return 0;
		}
	}

	setTransOffset(transOffset){
		if(transOffset){
			const value = transOffset * window.innerHeight;
			this.transOffset = value;
			return value;
		}else{
			this.transOffset = 0;
			return 0;
		}
	}

	/**
	 * 네비 버튼 on/off class 구분
	 */
	setActiveClass(){
		const targets = [];

		this.targetHash.forEach(target => {
			targets.push(
				document.getElementById(target)
			);
		});

		targets.forEach(target => {
			if(target){
				const rect = {
					top: target.getBoundingClientRect().top - this.helmet - this.transOffset,
					bottom: target.getBoundingClientRect().bottom - this.helmet - this.transOffset
				};
	
				if(rect.top <= 0 && rect.bottom > 0){
					const targetId = target.getAttribute('id');
					const activeLink = document.querySelector(`${this.wrapper} a[href="#${targetId}"]`);
					const inActiveLinks = document.querySelectorAll(`${this.wrapper} a:not([href="#${targetId}"])`);
	
					inActiveLinks?.forEach(inActiveLinks => {
						if(inActiveLinks.classList.contains(this.activeClass)){
							inActiveLinks.classList.remove(this.activeClass);
						}
					});
	
					if(!activeLink?.classList.contains(this.activeClass)){
						activeLink?.classList.add(this.activeClass);
					}
				}
			}
		});
	}

	/**
	 * 스크롤 이동 애니메이션
	 * @param {string} target - 이동할 요소의 ID 값
	 */
	moveTo(target){
		const targetEle = document.querySelector(target);
	
		if(targetEle){
			let startTime = null;
			const helmet = this.helmet - this.iosNotch;
			const targetPosition = targetEle.getBoundingClientRect().top;
			const startPosition = window.scrollY;
			const distance = targetPosition - helmet;
			const easingEffect = {
				linear(t){
					return t;
				},
				ease(t){
					return t < 0.5 ? 4 * t ** 3 : 0.5 * ((2 * t - 2) ** 3 + 2);
				},
				easeIn(t){
					return t ** 3;
				},
				easeOut(t){
					return 1 - (1 - t) ** 3;
				}
			};
			const moveScroll = currentTime => {
				if(startTime == null) startTime = currentTime;

				const elapsedTime = currentTime - startTime;
				const easeFunction = easingEffect[this.easing](elapsedTime / this.duration);
				const currentPosition = startPosition + distance * easeFunction;

				window.scrollTo(0, currentPosition);

				if(elapsedTime <= this.duration){
					// 애니메이션 종료 전
					requestAnimationFrame(moveScroll);
				}else if(currentTime >= elapsedTime){
					// 애니메이션 종료 후
					const value = window.scrollY + targetEle.getBoundingClientRect().top - helmet;
					window.scrollTo(0, value);
				}
			};

			requestAnimationFrame(moveScroll);
		}
	}

	/**
	 * 초기화
	 */
	init(options){
		this.navBtns.forEach(navBtn => {
			navBtn.addEventListener('click', e => {
				e.preventDefault();
				this.moveTo(e.target.hash);
			});
		});

		// on/off class 구분 있는 경우
		if(this.activeClass){
			this.setActiveClass();

			['scroll', 'resize', 'orientationchange'].forEach(event => {
				window.addEventListener(event, () => {this.setActiveClass()});
			});
		}

		// 헤더, 네비 높이 값만큼 간격 적용 있는 경우
		if(this.helmet){
			['resize', 'orientationchange'].forEach(event => {
				window.addEventListener(event, () => {this.setHelmet(options?.helmet)});
			});
		}

		['load', 'resize', 'orientationchange'].forEach(event => {
			window.addEventListener(event, () => {this.setTransOffset(options?.transOffset)});
		});
	}
}