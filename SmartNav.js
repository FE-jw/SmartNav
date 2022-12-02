/**
 * Version: 1.0.0
 * Web: https://fe-jw.github.io/SmartNav
 * GitHub: https://github.com/FE-jw/SmartNav
 * Released: ####-##-##
*/

class SmartNav{
	constructor(nav, options){
		this.nav = nav;
		this.navList = Array.prototype.slice.call(document.querySelector(nav).querySelectorAll('a'));
		this.navCont = [];
		this.duration = 300;

		if(options){
			this.duration = typeof options.duration != 'undefined' ? options.duration : this.duration;
		}

		this.initialize();
	}

	initialize(){
		this.navList.forEach(ele => {
			this.navCont.push(ele.hash);
			const duration = this.duration;

			ele.addEventListener('click', function(e){
				e.preventDefault();

				let navCont = document.getElementById(ele.hash.replace('#', ''));
				let scrollTop = {};
				scrollTop.from = window.scrollY;
				scrollTop.to = scrollTop.from + navCont.getBoundingClientRect().top;

				let start = new Date().getTime();
				let timer = setInterval(() => {
					var time = new Date().getTime() - start;
					var x = easeInQuad(time, scrollTop.from, scrollTop.to - scrollTop.from, duration);
					window.scrollTo({
						left: 0,
						top: x
					});
					if(time >= duration){
						clearInterval(timer);
						window.scrollTo({
							left: 0,
							top: scrollTop.to
						});
					}
				}, 1000 / 60);

				//http://easings.net
				//https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts
				//t: current time
				//b: beginning value(from)
				//c: change in value(to)
				//d: duration
				function linear(t, b, c, d) {
					return c * t / d + b;
				}

				function easeInQuad(t, b, c, d){
					return c * (t /= d) * t + b;
				}

				/*
				function easeInQuart(t, b, c, d){
					return c * (t /= d) * t * t * t + b;
				}

				function easeInOutQuart(t, b, c, d){
					if ((t /= d / 2) < 1) {
						return c / 2 * t * t * t * t + b;
					}else{
						return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
					}
				}
				*/
			});
		});
	}
}