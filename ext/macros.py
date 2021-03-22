import hashlib
import jinja2
import jinja2.ext
import os

MACROS_PATH = '/views/macros/'


class Counter(object):

    def __init__(self, value=0):
        self.value = value

    def increment(self, amount=1):
        self.value += amount
        return self.value

    def decrement(self, amount=1):
        self.value -= amount
        return self.value


def create_counter(initial_value=0):
    """Creates a counter.

    Example:

        {% set mycounter = create_counter() %}
        {{mycounter.value}}    =>  0
        {{mycounter.increment()}}   =>  1
        {{mycounter.increment(2)}}  =>  3

        {# Can be passed into macros #}

        {% macro dosomething(counter) %}
          {{c.increment()}}
        {% endmacro %}

        {{dosomething(mycounter)}}  =>  4
        {{mycounter.increment()}}  =>  5
    """
    return Counter(initial_value)

@jinja2.contextfilter
def generate_macros_filter(ctx, partial):
    macros = []
    pod = ctx.get('doc').pod
    for macro_path in pod.list_dir(MACROS_PATH):
        macro, _ = os.path.splitext(os.path.basename(macro_path))
        macros.append(macro)
    template_list = []
    for macro in macros:
        template_list.append(
            '{%% import "/views/macros/%(macro)s.html" as %(macro)s_lib with context %%}' % {'macro': macro})
    for macro in macros:
        template_list.append(
            '{%% macro %(macro)s(options) %%}{{%(macro)s_lib.%(macro)s(options, **kwargs)}}{%% endmacro %%}' % {'macro': macro})

    template_str = '\n'.join(template_list)
    template = pod.get_jinja_env().from_string(template_str)
    return template.make_module(ctx, locals={'partial': partial})


@jinja2.contextfilter
def do_localize(ctx, path):
    env = ctx['env']
    if env.name in ['google3', 'prod']:
        return str(path).replace('ALL_', '').replace('_ALL', '')
    return path


class TemplateExtensions(jinja2.ext.Extension):
    def __init__(self, env):
        super(TemplateExtensions, self).__init__(env)
        env.filters['generate_macros'] = generate_macros_filter
        env.filters['localize'] = do_localize
        env.globals['create_counter'] = create_counter
