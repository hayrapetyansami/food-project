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
  const deadline = "2024-05-21";

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
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data
    });

    return await result.json();
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
          status.textContent = messages.failure;
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

  // slider
  const slides = document.querySelectorAll(".offer__slide");
  const prev = document.querySelector(".offer__slider-prev");
  const next = document.querySelector(".offer__slider-next");
  const currentSlide = document.querySelector("#current");
  const totalSlides = document.querySelector("#total");
  let slideIndex = 1;

  showSlides(slideIndex);
  totalSlidesChange(totalSlides, slides.length);

  function totalSlidesChange(element, count) {
    return slides.length < 10
      ? element.textContent = `0${count}`
      : element.textContent = count;
  }

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slides.length;
    }

    slides.forEach(slide => slide.style.display = "none");
    slides[slideIndex - 1].style.display = "block";

    totalSlidesChange(currentSlide, slideIndex);
  }

  function changeSlide(n) {
    showSlides(slideIndex += n);
  }
  

  prev.addEventListener("click", () => {
    changeSlide(-1);
  });

  next.addEventListener("click", () => {
    changeSlide(1);
  });
});