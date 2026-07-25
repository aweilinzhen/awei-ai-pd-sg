(function () {
  "use strict";

  /* =========================================================
     Load Resume Data
  ========================================================= */

  const data = window.RESUME_DATA;

  if (!data) {
    console.error(
      "window.RESUME_DATA not found. Please check whether resume-data.js is loaded correctly."
    );
    return;
  }


  /* =========================================================
     HTML Escaping
  ========================================================= */

  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");


  /* =========================================================
     Bullet List
  ========================================================= */

  const bulletList = (items = []) => `
    <ul class="bullet-list">
      ${
        items
          .map(
            (item) =>
              `<li>${esc(item)}</li>`
          )
          .join("")
      }
    </ul>
  `;


  /* =========================================================
     Common Entry Component
  ========================================================= */

  const entry = (
    {
      title,
      period,
      subtitle,
      bullets
    },
    className = "entry"
  ) => `
    <article class="${className}">

      <div class="entry-heading">

        <h3>
          ${esc(title)}
        </h3>

        <time>
          ${esc(period)}
        </time>

      </div>

      ${
        subtitle
          ? `
            <p class="entry-subtitle">
              ${esc(subtitle)}
            </p>
          `
          : ""
      }

      ${
        bulletList(
          bullets
        )
      }

    </article>
  `;


  /* =========================================================
     Common Section Component
  ========================================================= */

  const section = (
    title,
    content,
    className = ""
  ) => `
    <section class="resume-section ${className}">

      <h2 class="section-title">
        ${esc(title)}
      </h2>

      ${content}

    </section>
  `;


  /* =========================================================
     AI Project Experience
  ========================================================= */

  const aiProjectHtml = entry(
    {
      title:
        data.aiProject.name,

      period:
        data.aiProject.period,

      subtitle:
        data.aiProject.subtitle,

      bullets:
        data.aiProject.bullets
    },
    "entry ai-project-entry"
  );


  /* =========================================================
     Professional Experience Pagination

     Page 1:
     - Professional Summary
     - AI Project Experience
     - First three companies

     Page 2:
     - Remaining companies
     - Selected Projects
     - Education

     On desktop, both pages are visually displayed
     as one continuous resume.
  ========================================================= */

  const firstPageExperienceHtml =
    data.experience
      .slice(
        0,
        3
      )
      .map(
        (item) =>
          entry(
            {
              title:
                item.company,

              period:
                item.period,

              subtitle:
                item.subtitle,

              bullets:
                item.bullets
            },
            "entry experience-entry"
          )
      )
      .join("");


  const secondPageExperienceHtml =
    data.experience
      .slice(
        3
      )
      .map(
        (item) =>
          entry(
            {
              title:
                item.company,

              period:
                item.period,

              subtitle:
                item.subtitle,

              bullets:
                item.bullets
            },
            "entry experience-entry"
          )
      )
      .join("");


  /* =========================================================
     Selected Projects
  ========================================================= */

  const projectsHtml =
    data.projects
      .map(
        (item) =>
          entry(
            {
              title:
                item.name,

              period:
                item.period,

              subtitle:
                item.subtitle,

              bullets:
                item.bullets
            },
            "entry project-entry"
          )
      )
      .join("");


  /* =========================================================
     Education
  ========================================================= */

  const educationHtml =
    data.education
      .map(
        (item) =>
          entry(
            {
              title:
                `${item.school} | ${item.degree}`,

              period:
                item.period,

              subtitle:
                "",

              bullets:
                item.bullets
            },
            "entry education-entry"
          )
      )
      .join("");


  /* =========================================================
     Get Resume Container
  ========================================================= */

  const resume =
    document.querySelector(
      "#resume"
    );

  if (!resume) {
    console.error(
      "#resume container not found."
    );
    return;
  }


  /* =========================================================
     Render Resume
  ========================================================= */

  resume.innerHTML = `

    <!-- =====================================================
         Page 1
    ====================================================== -->

    <section
      class="resume-page page-one"
      aria-label="Resume Page 1"
    >

      <!-- Profile Information -->

      <header class="profile-header">

        <div class="profile-main">

          <h1>
            ${
              esc(
                data.profile.name
              )
            }
          </h1>


          <!-- Contact Information -->

          <p class="contact-line">

            ${
              data.profile.location
                ? `
                  <span>
                    ${
                      esc(
                        data.profile.location
                      )
                    }
                  </span>
                `
                : ""
            }

            <span>
              ${
                esc(
                  data.profile.phone
                )
              }
            </span>

            <span>
              ${
                esc(
                  data.profile.email
                )
              }
            </span>

          </p>


          <!-- Target Role -->

          <p class="status-line">

            <span>
              ${
                esc(
                  data.profile.targetRole
                )
              }
            </span>

          </p>

        </div>

      </header>


      <!-- Professional Summary -->

      ${
        section(
          "Professional Summary",

          bulletList(
            data.summary
          )
        )
      }


      <!-- AI Project Experience -->

      ${
        section(
          "AI Project Experience",

          aiProjectHtml,

          "ai-project-section"
        )
      }


      <!-- Professional Experience -->

      ${
        section(
          "Professional Experience",

          firstPageExperienceHtml
        )
      }

    </section>


    <!-- =====================================================
         Page 2
    ====================================================== -->

    <section
      class="resume-page page-two"
      aria-label="Resume Page 2"
    >

      <!-- Continued Professional Experience -->

      ${
        section(
          "Professional Experience (Continued)",

          secondPageExperienceHtml,

          "continuation-section"
        )
      }


      <!-- Selected Projects -->

      ${
        section(
          "Selected Projects",

          projectsHtml
        )
      }


      <!-- Education -->

      ${
        section(
          "Education",

          educationHtml
        )
      }

    </section>

  `;


  /* =========================================================
     Desktop Continuous Page Mode

     Hide the "Professional Experience (Continued)"
     heading when viewing the resume on screen.

     This keeps the desktop page visually continuous:

     Professional Experience
     Company 1
     Company 2
     Company 3
     Company 4

     rather than displaying two separate
     Professional Experience sections.

     The print page can restore the heading if required.
  ========================================================= */

  const continuationTitle =
    document.querySelector(
      ".continuation-section .section-title"
    );

  if (continuationTitle) {
    continuationTitle.classList.add(
      "screen-only-hidden-title"
    );
  }


  /* =========================================================
     Print Function

     Stable print flow:

     Click Print
     ↓
     Clone the rendered #resume
     ↓
     Save the snapshot to localStorage
     ↓
     Open print.html?token=...
     ↓
     print.js reads the snapshot by token
     ↓
     Render two resume pages as high-resolution canvases
     ↓
     Chrome / Safari prints two A4 images
     ↓
     window.print()

     Why localStorage is used instead of relying only
     on window.opener:

     - Some browsers or security policies may isolate opener
     - opener may become unavailable after refreshing print.html
     - localStorage is shared within the same origin

     print.js can still use opener as a fallback.
  ========================================================= */

  const printButton =
    document.querySelector(
      "#printButton"
    );

  if (!printButton) {
    console.warn(
      "#printButton not found. The print function cannot be initialized."
    );
    return;
  }

  const PRINT_STORAGE_PREFIX =
    "resume-print-snapshot:";


  /* =========================================================
     Create Print Snapshot
  ========================================================= */

  const createPrintSnapshot = () => {
    const clonedResume =
      resume.cloneNode(true);

    /*
      Convert image paths to absolute URLs.

      This ensures that the profile photo can still load
      correctly even if print.html is moved to another folder
      in the future.
    */

    clonedResume
      .querySelectorAll("img[src]")
      .forEach((image) => {
        try {

          image.src = new URL(
            image.getAttribute("src"),
            window.location.href
          ).href;

        } catch (error) {

          console.warn(
            "Failed to convert image URL:",
            image.getAttribute("src"),
            error
          );

        }
      });

    return clonedResume.innerHTML;
  };


  /* =========================================================
     Print Button Event
  ========================================================= */

  printButton.addEventListener(
    "click",
    () => {

      if (printButton.disabled) {
        return;
      }


      printButton.disabled = true;


      /* -------------------------------------------------------
         Generate unique print token
      ------------------------------------------------------- */

      const token = [
        Date.now().toString(36),

        Math.random()
          .toString(36)
          .slice(2, 10)

      ].join("-");


      const storageKey =
        `${PRINT_STORAGE_PREFIX}${token}`;


      /* -------------------------------------------------------
         Build print snapshot payload
      ------------------------------------------------------- */

      const payload = {

        html:
          createPrintSnapshot(),

        title:
          document.title,

        createdAt:
          Date.now()

      };


      let snapshotStored = false;


      /* -------------------------------------------------------
         Store print snapshot
      ------------------------------------------------------- */

      try {

        localStorage.setItem(
          storageKey,
          JSON.stringify(payload)
        );

        snapshotStored = true;

      } catch (error) {

        /*
          If localStorage is unavailable,
          do not stop the print process.

          print.js can still attempt to read the resume
          through same-origin window.opener.
        */

        console.warn(
          "Unable to save the print snapshot. The opener fallback will be used:",
          error
        );

      }


      /* -------------------------------------------------------
         Open print page

         window.open must remain inside the synchronous
         user click event chain to avoid being blocked
         as an unsolicited pop-up.
      ------------------------------------------------------- */

      const printWindow =
        window.open(

          `print.html?token=${encodeURIComponent(token)}&v=${Date.now()}`,

          "_blank"

        );


      /* -------------------------------------------------------
         Handle blocked pop-up
      ------------------------------------------------------- */

      if (!printWindow) {

        if (snapshotStored) {

          localStorage.removeItem(
            storageKey
          );

        }


        printButton.disabled = false;


        alert(
          "The browser blocked the print window.\n\n" +
          "Please allow pop-ups for this website, then click \"Print / Save PDF\" again."
        );


        return;
      }


      /* -------------------------------------------------------
         Focus print window
      ------------------------------------------------------- */

      try {

        printWindow.focus();

      } catch (error) {

        console.warn(
          "Unable to focus the print window:",
          error
        );

      }


      /* -------------------------------------------------------
         Delayed snapshot cleanup

         Normally print.js deletes the snapshot immediately
         after reading it.

         This delayed cleanup prevents temporary print data
         from remaining in localStorage if the user closes
         the print page before it finishes loading.
      ------------------------------------------------------- */

      if (snapshotStored) {

        window.setTimeout(
          () => {

            localStorage.removeItem(
              storageKey
            );

          },
          60 * 1000
        );

      }


      /* -------------------------------------------------------
         Re-enable print button after a short debounce.

         The main page does not need to wait for the print page
         to complete because print.html handles printing
         independently.
      ------------------------------------------------------- */

      window.setTimeout(
        () => {

          printButton.disabled = false;

        },
        800
      );

    }
  );

})();
