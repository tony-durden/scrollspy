exports.ScrollSpy = class ScrollSpy {
	container;
	links;
	sections;
	sectionOffsetTop;
	url;

	constructor(options) {
		this.container = document.getElementById(options.id);
		this.links = document.querySelectorAll('.scrollspy-link');
		this.sections = Array.from(document.querySelectorAll('.scrollspy-section'));
		this.sectionOffsetTop = new Number(options.offsetTop);
		this.currentActive = new Number(0);
		this.url = window.location;
		this.init();
	}

	init() {
		this.getHashFromURL();
		if (this.container != null) {
			this.startScrollListener();
			this.startClickListener(this.links);
		} else {
			this.destroyScrollListener();
			this.destroyClickListener(this.links);
		}
	}
	getHashFromURL() {
		const url = new URL(window.location);
		if (url.hash !== '') {
			const target = url.hash.replace(/#(\S)/g, '$1');
			const foundSection = this.setFoundSection(target);
			this.setScrollPosition(foundSection);
		}
	}
	setHashOnURL(taget) {
		const url = new URL(window.location);
		url.hash = taget;
		window.history.pushState({}, '', url);
		return url;
	}
	setFoundSection(target) {
		const foundSection = this.sections.find((section) => section.id === target);
		if (foundSection !== undefined) {
			return foundSection;
		}
	}
	onClick(event) {
		event.preventDefault();
		const target = event.currentTarget.dataset.target;
		this.url = this.setHashOnURL(target);
		const foundSection = this.setFoundSection(target);
		this.setScrollPosition(foundSection);
	}
	onScroll() {
		const currentIndex = this.sections.length - [...this.sections].reverse().findIndex((section) => window.scrollY >= section.offsetTop - this.sectionOffsetTop) - 1;
		if (currentIndex !== this.currentActive) {
			this.removeAllActive();
			this.currentActive = currentIndex;
			this.setActiveClass(currentIndex);
		}
	}
	setScrollPosition(section) {
		window.scrollTo({
			top: section.offsetTop - this.sectionOffsetTop,
			left: 0,
			behavior: 'smooth',
		});
	}
	setActiveClass(index) {
		this.links[index].classList.add('active');
	}
	removeActiveClass(index) {
		this.links[index].classList.remove('active');
	}
	removeAllActive() {
		[...Array(this.sections.length).keys()].forEach((key) => this.removeActiveClass(key));
	}
	startClickListener(links) {
		links.forEach((link) => link.addEventListener('click', this.onClick.bind(this)));
	}
	destroyClickListener(links) {
		links.forEach((link) => link.removeEventListener('click', this.onClick.bind(this)));
	}
	startScrollListener() {
		window.addEventListener('scroll', this.onScroll.bind(this));
	}
	destroyScrollListener() {
		window.removeEventListener('scroll', this.onScroll.bind(this));
	}
};
