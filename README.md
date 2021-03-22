# google-starter

## Developer setup

This project uses [Grow.dev](https://grow.dev), a static site generator.

### Prerequisites

At a minimum, you will need:

- [Pipenv](https://pipenv.pypa.io/en/latest/install/#installing-pipenv)
- [Node](https://github.com/nvm-sh/nvm#installing-and-updating)

After Pipenv and Node are setup, install the project using the following
command. This installs the correct version of Python, and also installs Grow.

```bash
pipenv install
```

### Running the development server

Prior to starting the development server, you may have to install dependencies
used by your project. The `grow install` command walks you through this and
tries to set up your environment for you. `grow install` installs both Python
extensions and JavaScript/Node dependencies.

```bash
pipenv run grow install
```

The `grow run` command starts your development server. You can make changes to
your project files and refresh to see them reflected immediately.

```bash
pipenv run grow run
```

### Building

You can use the `grow build` command to build your whole site to the `build`
directory. This is a good way to test and verify the generated code.

```
pipenv run grow build
```

### Syncing strings

GYou can sync website copy by running a Grow command. You may commit the
changes to push changes live.

```
pipenv run grow preprocess -t strings
```

### Staging

Changes are staged on webreview. Run `grow stage` to stage a working copy, or
push a branch to Google Cloud Repositories to generate a staging URL.

Staging URLs follow the format:

```
https://starter-<branch>-dot-googwebreview.appspot.com
```

### Deployment

Deployment is handled via Google Cloud Build. Push the website live by pushing
to `main` on the Google Cloud Repositories mirror.

### Google Cloud Build setup

1. Identify a Google Cloud Platform project to use for deployment. Either
   create a new one, or use an existing one.
1. If using an existing GCP project, update the `service:` key in `app.yaml`.
   GCP projects can deploy multiple services. By using a new service, you can
   deploy two sites to the same GCP project, avoiding overwriting the
   currently-deployed site. Use the site's "ID" for the value of `service:`.
1. Update `Makefile` with the corresponding GCP project ID, repo ID, and repo
   URL (lines 1, 3, and 4).
1. Run `make buildbot-setup`.
1. Ensure the repository is connected to the GCP project, per the output of the
   previous command.
1. If you are staging to webreview:
  1. Update the `webreview` deployment settings in `podspec.yaml`.
  1. Uncomment line 51 in `cloudbuild.yaml` and delete line 52.
1. Commit and push `buildbot-service-account-key.enc`.
1. Test the deployment by visiting the Build History page:
   `https://console.cloud.google.com/cloud-build/builds?project=PROJECT`

## Developer notes

### Responsive styles

We include the [responsive
styles](https://github.com/grow/grow-ext-responsive-styles) extension.
Responsive styles permit developers to manage styles adjacent to content within
YAML, rather than contained within a stylesheet. This is typically useful for
applying content-specific style overrides that may not be reused elsewhere
around the project. For example, you may want to resize a specific image (and
only that image) differently on desktop and mobile.

To use responsive styles:

1. Update breakpoint settings in `podspec.yaml`
2. Import the responsive style macro.

```
{% import "/extensions/responsive_styles/responsive_styles.html"
    as responsive_styles with context %}
```

3. Place the responsive style ID on the element where the style should be applied.

```
<img {{responsive_style_id(params.responsive_styles)}}>
```

The value of `params.responsive_styles` is a mapping of breakpoint to styles.
For example:

```
responsive_styles:
   mobile: 'max-width: 64px'
   tablet: 'max-width: 64px'
   desktop: 'max-width: 200px'
```

### CSS splitting

We can take advantage of Grow's modular page structure to optimize how
our CSS is loaded, which improves initial page load times. The overall
idea is to inline critical (above the fold) CSS, so that it loads
ASAP, while deferring everything else.

To use this system, you only need to follow two rules:

1. Each partial should have all of its styles in a SASS file with the
   same name. So, `hero.html` -> `hero.sass`.
2. Each SASS file must explicitly import every other file it
   references. The build will error if you don't do this.

We want to parallelize and defer as much as we can, but also avoid a
FOUC. So in `base.html`, we grab the CSS for the *header*, plus the
*first two partials*, and inline it (i.e. output the CSS directly into
the `<head>`). This makes the browser parse that CSS immediately,
avoiding any FOUC.

Then, we can safely defer the rest: we load all the rest of the
partials' CSS asynchronously, as separate files. Using the
`rel="preload"` attribute, the browser will begin downloading those
CSS files as soon as it encounters them, without blocking the initial
render, and then incorporate their rules later, whenever the download
is finished.

If more partials need to have their styles inlined (if there's a
complex page with >2 partials above the fold), you can add the
`inline_styles` parameter to their content YAML:

```yaml
partials:
...
- partial: cool-partial
  inline_styles: true
  ...
```
