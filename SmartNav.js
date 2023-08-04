/**
 * Version: 1.0.0
 * Web: https://fe-jw.github.io/SmartNav
 * GitHub: https://github.com/FE-jw/SmartNav
 * Released: ####-##-##
*/

class SmartNav{
	constructor(selector, options){
		this.wrapper = selector;
		this.navBtns = document.querySelector(selector).querySelectorAll('a');
		this.duration = options?.duration ?? 500;
		this.fixed = options?.fixed ?? 0;
		this.transPoint = options?.transPoint ? options.transPoint * window.innerHeight : 0;
		this.activeClass = options?.activeClass;
		this.easing = options?.easing ?? 'ease';
		this.iosNotch = options?.iosNotch ?? this.getNotchValue;
		this.#init();

		window.addEventListener('scroll', () => {this.#activeNav()});
		window.addEventListener('resize', () => {this.#activeNav()});
		window.addEventListener('orientationchange', () => {this.#activeNav()});
	}

	get getNotchValue(){
		const tempEle = document.createElement('div');
		tempEle.setAttribute('style', 'top:constant(safe-area-inset-top);top:env(safe-area-inset-top)');
		const value = Number(window.getComputedStyle(tempEle).top.replace('px', ''));

		return value;
	}

	get targetHash(){
		const hashArr = [];
	
		this.navBtns.forEach(navBtn => {
			const id = navBtn.hash.replace('#', '');
			hashArr.push(id);
		});

		return hashArr;
	}

	#activeNav(){
		if(this.activeClass){
			const targets = [];
	
			this.targetHash.forEach(target => {
				targets.push(
					document.getElementById(target)
				);
			});
	
			targets.forEach(target => {
				if(target){
					const rect = {
						top: target.getBoundingClientRect().top - this.fixed - this.transPoint,
						bottom: target.getBoundingClientRect().bottom - this.fixed - this.transPoint
					};
		
					if(rect.top <= 0 && rect.bottom > 0){
						const targetId = target.getAttribute('id');
						const activeLink = document.querySelector(`${this.wrapper} a[href="#${targetId}"]`);
						const inactiveLinks = document.querySelectorAll(`${this.wrapper} a:not([href="#${targetId}"])`);
		
						inactiveLinks?.forEach(inactiveLink => {
							if(inactiveLink.classList.contains(this.activeClass)) inactiveLink.classList.remove(this.activeClass);
						});
		
						if(!activeLink?.classList.contains(this.activeClass)) activeLink?.classList.add(this.activeClass);
					}
				}
			});
		}
	}

	#smoothScroll(target){
		const targetEle = document.querySelector(target);
	
		if(targetEle){
			const helmet = this.fixed - this.iosNotch;
			const targetPosition = targetEle.getBoundingClientRect().top;
			const startPosition = window.scrollY;
			const distance = targetPosition - helmet;
			let startTime = null;

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

				switch(true){
					case elapsedTime <= this.duration:
						requestAnimationFrame(moveScroll);
						break;
					case currentTime >= elapsedTime:
						const value = window.scrollY + targetEle.getBoundingClientRect().top - helmet;
						window.scrollTo(0, value);
						break;
					default:
						break;
				}
			};

			requestAnimationFrame(moveScroll);
		}
	}

	#init(){
		this.navBtns.forEach(navBtn => {
			navBtn.addEventListener('click', event => {
				event.preventDefault();
				this.#smoothScroll(event.target.hash);
			});
		});

		this.#activeNav();
	}
}