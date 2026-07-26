
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();
const header=$("#siteHeader");
addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>40));

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}})
},{threshold:.14,rootMargin:"0px 0px -70px 0px"});
$$(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el=>io.observe(el));

const menu=$("#mobileMenu");
$("#menuBtn").addEventListener("click",()=>{menu.classList.toggle("open");document.body.classList.toggle("lock")});
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");document.body.classList.remove("lock")}));


function createInfiniteRail({
  viewportSelector,
  trackSelector,
  groupSelector,
  direction = -1,
  speed = 34
}) {
  const viewport = document.querySelector(viewportSelector);
  const track = document.querySelector(trackSelector);
  const group = document.querySelector(groupSelector);

  if (!viewport || !track || !group) return;

  let offset = 0;
  let paused = false;
  let lastTime = performance.now();
  let groupWidth = 0;

  const measure = () => {
    groupWidth = group.getBoundingClientRect().width;
    if (!Number.isFinite(groupWidth) || groupWidth <= 0) {
      groupWidth = group.scrollWidth;
    }
  };

  const normalize = () => {
    if (!groupWidth) return;

    if (direction < 0) {
      while (offset <= -groupWidth) offset += groupWidth;
      while (offset > 0) offset -= groupWidth;
    } else {
      while (offset >= 0) offset -= groupWidth;
      while (offset < -groupWidth) offset += groupWidth;
    }
  };

  const animate = now => {
    const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (!paused && groupWidth > 0) {
      offset += direction * speed * deltaSeconds;
      normalize();
      track.style.transform = `translate3d(${offset}px,0,0)`;
    }

    requestAnimationFrame(animate);
  };

  viewport.addEventListener("mouseenter", () => paused = true);
  viewport.addEventListener("mouseleave", () => paused = false);
  viewport.addEventListener("touchstart", () => paused = true, { passive: true });
  viewport.addEventListener("touchend", () => paused = false, { passive: true });

  window.addEventListener("resize", () => {
    const previousWidth = groupWidth || 1;
    const ratio = offset / previousWidth;
    measure();
    offset = ratio * groupWidth;
    normalize();
  });

  const images = [...track.querySelectorAll("img")];
  let pending = images.length;

  const start = () => {
    measure();
    normalize();
    requestAnimationFrame(animate);
  };

  if (!pending) {
    start();
  } else {
    const done = () => {
      pending -= 1;
      if (pending <= 0) start();
    };
    images.forEach(img => {
      if (img.complete) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }
}

createInfiniteRail({
  viewportSelector: ".rail",
  trackSelector: "#clinicRailTrack",
  groupSelector: "#clinicRailGroup",
  direction: -1,
  speed: 38
});

createInfiniteRail({
  viewportSelector: ".service-rail",
  trackSelector: "#serviceRailTrack",
  groupSelector: "#serviceRailGroup",
  direction: 1,
  speed: 30
});

const doctorTrack=$("#doctorTrack"),doctorSlides=$$(".doctor-slide"),doctorCount=$("#doctorCount");
let doctorIndex=0,doctorTimer;
const showDoctor=n=>{
  doctorIndex=(n+doctorSlides.length)%doctorSlides.length;
  doctorTrack.style.transform=`translateX(-${doctorIndex*100}%)`;
  doctorCount.textContent=`${String(doctorIndex+1).padStart(2,"0")} / ${String(doctorSlides.length).padStart(2,"0")}`;
};
const restartDoctors=()=>{
  clearInterval(doctorTimer);
  doctorTimer=setInterval(()=>showDoctor(doctorIndex+1),7000);
};
$("#doctorPrev").addEventListener("click",()=>{showDoctor(doctorIndex-1);restartDoctors()});
$("#doctorNext").addEventListener("click",()=>{showDoctor(doctorIndex+1);restartDoctors()});
showDoctor(0);restartDoctors();

$("#bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const missing=$$("[required]",e.currentTarget).find(el=>!el.value.trim());
  const status=$("#formStatus");
  if(missing){missing.focus();status.textContent="Please complete the required fields.";return}
  status.textContent="Thank you. This demo form is ready to connect to a real booking system.";
  e.currentTarget.reset();
});
