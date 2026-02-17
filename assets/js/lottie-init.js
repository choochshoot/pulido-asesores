document.addEventListener("DOMContentLoaded",()=>{

  document.querySelectorAll(".lottie-icon").forEach((el,index)=>{

    const animation = lottie.loadAnimation({
      container: el,
      renderer:"svg",
      loop:false,
      autoplay:false,
      path: el.dataset.path
    });

    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setTimeout(()=>{
            el.classList.add("reveal-icon");
            animation.play();
          }, index * 200);
        }
      });
    },{threshold:.4});

    observer.observe(el);

  });

});
