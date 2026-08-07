(() => {

  // --- Render helpers ---

  function renderLink(link) {
    if (link.strikethrough) {
      const note = link.note ? ` - ${link.note}` : '';
      return `<p class="job-link"><span class="sous_rature">${link.label}</span>${note}</p>`;
    }
    if (link.url) {
      const note = link.note ? ` - ${link.note}` : '';
      return `<p class="job-link"><a href="${link.url}">${link.label}</a>${note}</p>`;
    }
    return `<p>${link.label}</p>`;
  }

  function renderLinks(links) {
    if (!links || links.length === 0) return '';
    return `<div class="subhead">Links:</div>\n${links.map(renderLink).join('\n')}`;
  }

  // Description items are either strings (paragraphs) or { image, alt } objects
  function renderDescriptionItem(item) {
    if (typeof item === 'string') return `<p>${item}</p>`;
    return `<img loading="lazy" class="secondary" alt="${item.alt}" src="${item.image}">`;
  }

  // --- Section builders ---

  function buildTestimonials(testimonials) {
    return testimonials.map(t => {
      const cls = t.mobileHighlight ? ' class="mbl_hilite"' : '';
      return `<blockquote${cls}>
          <p>${t.quote}</p>
          <div class="attribution">${t.name} - <cite>${t.role}, ${t.company}</cite></div>
        </blockquote>`;
    }).join('\n');
  }

  function buildNavigation(nav) {
    const employerItems = nav.employers
      .map(e => `<li><a target="_self" href="#${e.anchor}">${e.label}</a></li>`)
      .join('\n            ');

    const personalItems = nav.personal
      .map(e => `<li class="personal"><a target="_self" href="#${e.anchor}">${e.label}</a></li>`)
      .join('\n            ');

    return `<header>Quick links</header>
        <nav>
          <ul>
            ${employerItems}
          </ul>
          <ul>
            ${personalItems}
          </ul>
        </nav>`;
  }

  function buildProjectCard(project) {
    const classes = project.desktopOnly ? 'job dt_only' : 'job';
    const dateHtml = project.dateRange ? `<p class="job-date">${project.dateRange}</p>` : '';
    const descHtml = project.description.map(renderDescriptionItem).join('\n              ');
    const linksHtml = renderLinks(project.links);

    return `<div class="${classes}">
          <img loading="lazy" class="thumb" alt="${project.thumbAlt}" src="${project.thumb}">
          <details>
            <summary>
              <p class="client">${project.client}</p>
              <p class="title">${project.title}</p>
            </summary>
            <section class="content">
              ${dateHtml}
              ${descHtml}
              <p class="tech-stack">${project.techStack}</p>
              ${linksHtml}
            </section>
          </details>
        </div>`;
  }

  function buildEmployerCard(employer) {
    const summaryHtml = employer.summary.map(p => `<p>${p}</p>`).join('\n            ');
    const techStackHtml = employer.techStack
      ? `<p class="tech-stack">${employer.techStack}</p>` : '';
    const linksHtml = employer.links
      ? employer.links.map(l => `<p><a href="${l.url}">${l.label}</a></p>`).join('\n            ') : '';

    return `<div id="${employer.id}" class="job double">
          <div class="double__inner">
            <img class="secondary" alt="${employer.logoAlt}" src="${employer.logo}">
            <h2 class="client">${employer.role}</h2>
            <p class="job-date">${employer.dateRange}</p>
            <div class="job-summary">
              ${summaryHtml}
              ${techStackHtml}
              ${linksHtml}
            </div>
          </div>
        </div>
        ${employer.projects.map(buildProjectCard).join('\n        ')}`;
  }

  function buildTraining(training) {
    const providersHtml = training.providers.map(provider => {
      const coursesHtml = provider.courses.map(course => {
        const imageHtml = course.image
          ? `<img loading="lazy" class="thumb" alt="${course.imageAlt}" src="${course.image}">` : '';
        const linksHtml = course.links
          .map(l => `<p class="job-link"><a href="${l.url}">${l.label}</a></p>`)
          .join('\n                ');

        return `<div>
                <p class="subhead">${course.title}</p>
                ${imageHtml}
                <p>${course.description}</p>
                ${linksHtml}
              </div>`;
      }).join('\n              ');

      return `<div class="job training">
          <img loading="lazy" class="thumb" alt="${provider.thumbAlt}" src="${provider.thumb}">
          <details>
            <summary>
              <p class="client">${provider.provider}</p>
            </summary>
            <section class="content">
              ${coursesHtml}
            </section>
          </details>
        </div>`;
    }).join('\n        ');

    return `<section id="training">
        <header>Training</header>
        <article class="news">
          <p>${training.intro}</p>
        </article>
      </section>
      <div class="jobListing">
        ${providersHtml}
      </div>`;
  }

  function buildPlayground(playground) {
    const introHtml = playground.intro.map(p => `<p>${p}</p>`).join('\n          ');
    const projectsHtml = playground.projects.map(buildProjectCard).join('\n        ');

    return `<section id="playground">
        <header>Playground</header>
        <article class="news">
          ${introHtml}
        </article>
      </section>
      <div class="jobListing">
        ${projectsHtml}
      </div>`;
  }

  function applyAnimations() {
    const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
      if (!isReduced) {
        const script = document.createElement('script');
        script.src = '/static/js/animations.min.js';
        script.defer = true;
        document.head.appendChild(script);
      }
  }

  // --- Bootstrap ---

  fetch('/data/site.json')
    .then(res => res.json())
    .then(data => {
      document.getElementById('testimonials').innerHTML = buildTestimonials(data.testimonials);
      document.getElementById('navigation').innerHTML   = buildNavigation(data.navigation);
      document.getElementById('jobs').innerHTML         = data.employers.map(buildEmployerCard).join('\n        ');
      document.getElementById('training').innerHTML     = buildTraining(data.training);
      document.getElementById('playground').innerHTML   = buildPlayground(data.playground);
    })
    .then(applyAnimations)
    .catch(err => console.error('Failed to load site data:', err));

})();
