window.addEventListener("DOMContentLoaded", () => {
  //  tabs start
  const tabs = document.querySelectorAll(".tabheader__items .tabheader__item");
  const tabsContent = document.querySelectorAll(".tabcontainer .tabcontent");
  const tabsParent = document.querySelector(".tabheader__items");
  let animate = false;

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add("hide");
      item.classList.remove("show", `${animate ? "fade" : null}`);
    });

    tabs.forEach(item => item.classList.remove("tabheader__item_active"));
  }

  function showTabContent(item = 0) {
    tabsContent[item].classList.remove("hide");
    tabsContent[item].classList.add("show", `${animate ? "fade" : null}`);
    tabs[item].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".tabheader__item")) {
      tabs.forEach((item, index) => {
        if (e.target === item) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });
  //  tabs end

  // timer start
  const deadline = "2024-08-08";

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endtime) - Date.parse(new Date());

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;

      // alternative varfiant
      // document.querySelector(".timer").innerHTML = `
      //   <h4
      //     style="
      //       text-align: center;
      //       color: red;
      //       width: 100%;
      //       text-transform: uppercase;
      //       font-size: 34px
      //     "
      //   >
      //     sale is out !

      //   </h4>
      // `;
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours = Math.floor(total / (1000 * 60 * 60) % 24);
      minutes = Math.floor((total / 1000 / 60) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }

    return { total, days, hours, minutes, seconds };
  }

  function setZero(n) {
    return n >= 0 && n < 10 ? `0${n}` : n;
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const daysElement = timer.querySelector("#days");
    const hoursElement = timer.querySelector("#hours");
    const minutesElement = timer.querySelector("#minutes");
    const secondsElement = timer.querySelector("#seconds");
    const intervalID = setInterval(updateClock, 1000);

    updateClock();
    function updateClock() {
      const { total, days, hours, minutes, seconds } = getTimeRemaining(endtime);

      daysElement.innerHTML = setZero(days);
      hoursElement.innerHTML = setZero(hours);
      minutesElement.innerHTML = setZero(minutes);
      secondsElement.innerHTML = setZero(seconds);

      if (total <= 0) {
        clearInterval(intervalID);
      }
    }
  }

  setClock(".timer", deadline);
  // timer end

  // modal
  const openModalBtn = document.querySelectorAll("[data-open-modal]");
  const modal = document.querySelector("[data-modal]");
  const closeModalBtn = document.querySelector("[data-close-modal]");

  function openModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.dataset.isOpen = true;
    clearTimeout(modalTimerId);
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    // modal.dataset.isOpen = false;
  }

  function closeModalAnotherVariants(event) {
    if (event.target === modal || event.code === "Escape") {
      if (modal.matches(".show")) {
        closeModal();
      }
    }
  }

  openModalBtn.forEach(btn => btn.addEventListener("click", openModal));
  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => closeModalAnotherVariants(e));
  document.addEventListener("keydown", (e) => closeModalAnotherVariants(e));

  const modalTimerId = setTimeout(openModal, 500000);

  function showModalByScroll() {
    if (
      window.scrollY + document.documentElement.clientHeight
      >=
      document.documentElement.scrollHeight
      &&
      modal.dataset.isOpen === "false"
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
  window.addEventListener("scroll", showModalByScroll);
  // modal end

  // menu card
  class MenuCard {
    constructor(src, alt, title, descr, price, parent) {
      this.parent = document.querySelector(parent);
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.change = 398.7;
      this.changeToAMD();
    }

    changeToAMD() {
      this.price = this.price * this.change;
    }

    render() {
      const element = document.createElement("div");
      const { src, alt, title, descr, price } = this;
      element.innerHTML = `
        <div class="menu__item" style="max-width: 280px">
          <img src=${src} alt=${alt}>
          <h3 class="menu__item-subtitle">${title}</h3>
          <div class="menu__item-descr">${descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${price.toFixed(2)}</span> amd/день</div>
          </div>
        </div>
      `;
      this.parent.append(element);
    }
  }

  getData("http://localhost:8888/menu")
    .then(data => {
      data.forEach(item => {
        new MenuCard(
          `../back/uploads/${item.image}`,
          `${item.title}`,
          `${item.title}`,
          `${item.description}`,
          `${item.price}`,
          ".menu__field .container"
        ).render();
      });
    });

  // forms & fetch
  async function postData(url, data) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data
    });
  }

  async function getData(url) {
    const result = await fetch(url);

    if (result.ok) {
      return await result.json();
    }
  }

  const forms = document.querySelectorAll("form");
  const status = document.querySelector("#status");
  forms.forEach(form => bindPostData(form));

  const messages = {
    loading: "Загрузка",
    success: "Успех",
    failure: "Отказ"
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      status.textContent = messages.loading;

      postData("http://localhost:8888/data", JSON.stringify(Object.fromEntries(new FormData(e.target))))
        .then(res => {
          if (!res.ok) {
            status.textContent = messages.failure;
          } else {
            status.textContent = messages.success;
          }
        })
        .catch(err => {
          status.textContent = `${messages.failure}: ${err} `;
        })
        .finally(() => {
          const timerID = setTimeout(() => {
            e.target.reset();
            status.textContent = "";
            clearTimeout(timerID);
          }, 1500);
        });
    });
  }

  // slider carousel
  const slider = document.querySelector(".offer__slider");
  const slides = document.querySelectorAll(".offer__slide");
  const prev = document.querySelector(".offer__slider-prev");
  const next = document.querySelector(".offer__slider-next");
  const currentSlide = document.querySelector("#current");
  const totalSlides = document.querySelector("#total");
  const sliderWrapper = document.querySelector(".offer__slider-wrapper");
  const sliderInner = document.querySelector(".offer__slider-inner");
  const sliderWidth = parseFloat(window.getComputedStyle(sliderWrapper).width);
  let slideIndex = 1;
  let offset = 0;

  sliderInner.style.width = 100 * slides.length + "%";
  sliderInner.style.display = "flex";
  sliderInner.style.transition = "0.5s all";
  sliderWrapper.style.overflow = "hidden";
  slides.forEach(slide => slide.style.width = sliderWidth);

  const dotsWrapper = document.createElement("div");
  const dots = [];

  dotsWrapper.style.cssText = `
    position: absolute;
    right: 0;
    left: 0;
    bottom: 10px;
    z-index: 55;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    user-select: none;
    gap: 8px;
  `;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("div");
    dot.setAttribute("data-slide-to", i + 1);
    dot.style.cssText = `
      box-sizing: border-box;
      flex: 0 1 auto;
      width: 12px;
      height: 12px;
      cursor: pointer;
      background: #fff;
      background-clip: padding-box;
      border: 1px solid #000;
      opacity: 0.5;
      transition: opacity 0.6 ease;
      border-radius: 50%;
      box-shadow: 0px 0px 16px 4px #000
    `;

    dotsWrapper.append(dot);

    if (i == 0) dot.style.opacity = 1;
    dots.push(dot);
  }

  slider.append(dotsWrapper);

  totalSlidesCount(totalSlides, slides.length);
  totalSlidesCount(currentSlide, slideIndex);

  function totalSlidesCount(element, count) {
    return slides.length < 10
      ? element.textContent = `0${count}`
      : element.textContent = count;
  }

  function currentSlidesCount(state) {
    switch (state) {
      case "next":
        slideIndex == slides.length ? slideIndex = 1 : slideIndex++;
        break;
      case "prev":
        slideIndex == 1 ? slideIndex = slides.length : slideIndex--;
        break;
    }

    totalSlidesCount(currentSlide, slideIndex);
  }

  function dotsChange() {
    dots.forEach(dot => dot.style.opacity = "0.5");
    dots[slideIndex - 1].style.opacity = 1;
  }

  next.addEventListener("click", () => {
    offset == sliderWidth * (slides.length - 1) ?
      offset = 0 : offset += sliderWidth;
    sliderInner.style.transform = `translateX(-${offset}px)`;

    currentSlidesCount("next");
    dotsChange();
  });

  prev.addEventListener("click", () => {
    offset == 0 ?
      offset = sliderWidth * (slides.length - 1) :
      offset -= sliderWidth;

    sliderInner.style.transform = `translateX(-${offset}px)`;
    currentSlidesCount("prev");
    dotsChange();
  });

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const slideTo = parseInt(e.target.dataset.slideTo);
      slideIndex = slideTo;
      offset = sliderWidth * (slideTo - 1);
      sliderInner.style.transform = `translateX(-${offset}px)`
      dotsChange();
      totalSlidesCount(currentSlide, slideIndex);
    });
  });

  // calculator
  const calcResult = document.querySelector(".calculating__result span");
  let gender = "male", height, weight, age, ratio = 1.375;

  function changeLocalStorageState(key, v, initialValue) {
    if (localStorage.getItem(key)) {
      v = localStorage.getItem(key);
    } else {
      v = initialValue;
      localStorage.setItem(key, initialValue);
    }

    return v;
  }

  function initClassesSettings(elements, activeClass, state, event) {
    if (state === "running") {
      elements.forEach(elem => elem.classList.remove(activeClass));
      event.target.classList.add(activeClass);
    }

    if (state === "starting") {
      elements.forEach(elem => {
        elem.classList.remove(activeClass);

        if (elem.getAttribute("id") === localStorage.getItem("gender")) {
          elem.classList.add(activeClass);
        }

        if (elem.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
          elem.classList.add(activeClass);
        }
      })
    }
  }

  function calcTotal() {
    if (!gender || !height || !weight || !age || !ratio) {
      calcResult.textContent = 0;
      return;
    }

    if (gender === "female") {
      calcResult.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
      calcResult.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
  }

  function getStaticInfo(selector, activeClass) {
    const elements = document.querySelectorAll(`${selector} div`);

    document.querySelector(selector).addEventListener("click", (e) => {
      if (e.target.getAttribute("data-ratio")) {
        ratio = parseFloat(e.target.getAttribute("data-ratio"));
        localStorage.setItem("ratio", ratio);
        initClassesSettings(elements, activeClass, "running", e);
      }

      if (e.target.getAttribute("id") === "male" || e.target.getAttribute("id") === "female") {
        gender = e.target.getAttribute("id");
        localStorage.setItem("gender", gender);
        initClassesSettings(elements, activeClass, "running", e);
      }

      calcTotal();
    });
  }

  function getDynamicInfo(selector) {
    const input = document.querySelector(selector);

    input.addEventListener("input", () => {
      if (input.value.match(/\D/g)) {
        input.classList.add("invalid");
        input.classList.remove("valid");
      } else {
        input.classList.add("valid");
        input.classList.remove("invalid");
        switch (input.getAttribute("id")) {
          case "height":
            height = parseFloat(input.value);
            break;
          case "weight":
            weight = parseFloat(input.value);
            break;
          case "age":
            age = parseFloat(input.value);
            break;
        }
      }


      calcTotal();
    });
  }

  gender = changeLocalStorageState("gender", gender, "female");
  ratio = changeLocalStorageState("ratio", ratio, 1.375);

  initClassesSettings(document.querySelectorAll("#gender div"), "calculating__choose-item_active", "starting");
  initClassesSettings(document.querySelectorAll(".calculating__choose_big div"), "calculating__choose-item_active", "starting");
  
  getStaticInfo("#gender", "calculating__choose-item_active");
  getStaticInfo(".calculating__choose_big", "calculating__choose-item_active");
    
  getDynamicInfo("#height");
  getDynamicInfo("#weight");
  getDynamicInfo("#age");
  
  calcTotal();
});