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

		this.initialize();
	}

	initialize(){
		this.navList.forEach(ele => {
			this.navCont.push(ele.hash);

			ele.addEventListener('click', function(e){
				e.preventDefault();

				let navCont = document.getElementById(ele.hash.replace('#', ''));
				let currentTop = window.scrollY;
				let winTop = currentTop + navCont.getBoundingClientRect().top;

				/* window.scroll({
					left: 0,
					top: 1000,
					behavior: 'smooth'
				}); */

				/* let num = 0;
				let numInterval = setInterval(() => {
					num++;
					console.log('timer:', num);
				}, 1000); */
				
				/* let myInterval = setInterval(() => {
					console.log('myInterval');
					window.scrollTo(0, ++currentTop);
					console.log(currentTop);

					if(currentTop >= winTop){
						console.log('clearInterval');
						clearInterval(myInterval);
						clearInterval(numInterval);
						console.log(num);
					}
				}, 10); */

				function scrollToSmoothly(pos, time) {
					var currentPos = window.scrollY;
					var start = null;
					if(time == null) time = 500;
					pos = +pos,time = +time;
					window.requestAnimationFrame(function step(currentTime) {
					    start = !start ? currentTime : start;
					    var progress = currentTime - start;
					    if (currentPos < pos) {
						  window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
					    } else {
						  window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
					    }
					    if (progress < time) {
						  window.requestAnimationFrame(step);
					    } else {
						  window.scrollTo(0, pos);
					    }
					});
				  }

				  scrollToSmoothly(winTop, 250);
			});
		});
	}
}

/*
	10px을 1000ms에 이동하려면?
		=> 100ms마다 1px씩 이동
	1000px을 500ms에 이동하려면?
		=> 0.5ms마다 1px씩 이동
*/