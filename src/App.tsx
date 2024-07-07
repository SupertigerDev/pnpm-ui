import { createSignal, For, onMount, Show } from 'solid-js'
import styles from './App.module.css'
import { createStore } from 'solid-js/store'
import { A, useMatch, useParams } from '@solidjs/router'


interface Project {
  id: string
  name: string
  path: string,
  packageContents: null | Record<string, any>
}

const [projects, setProjects] = createStore<Record<string, Project>>({
  "1": {
    id: "1",
    name: 'nerimity-web',
    path: "E:\\Nerimity\\nerimity-web\\",

    packageContents: null
  }
})

const Drawer = () => {
  const projectArray = () => Object.values(projects);

  return (
    <div class={styles.drawer}>
      <For each={projectArray()}>
        {project => <A activeClass={styles.selected} class={styles.link} href={`/${project.id}`}>{project.name}</A>}
      </For>
    </div>
  )
}


const ProjectView = () => {
  const params = useParams<{projectId: string}>();
  
  const project = () => projects[params.projectId];

  return (
    <div class={styles.projectView}>
      <h1 class={styles.title}>{project().name}</h1>
      <p class={styles.path}>{project().path}</p>
      <Dependencies/>
    </div>
  )
}

function App() {
  const params = useParams<{projectId?: string}>();


  return (
    <>
      <Drawer/>
      <Show when={params.projectId}>
        <ProjectView/>
      </Show>
    </>
  )
}

const fs = window.require("fs/promises") as typeof import("fs/promises");
const Dependencies = () => {
  const params = useParams<{projectId: string}>();
  const project = () => projects[params.projectId];

  onMount(async () => {
    if (!project().packageContents) {
      const packageContents = await fs.readFile(project().path + "package.json", "utf8").catch(e => alert(e.message));
      if (!packageContents) return;
      try {
        setProjects(params.projectId, "packageContents", JSON.parse(packageContents));
      } catch (e) {
        alert(e);
      }
    }
  })

  const dependencies = () => project().packageContents?.dependencies;
  const devDependencies = () => project().packageContents?.devDependencies;

  return (
    <div class={styles.dependenciesContainer}>
      <Show when={devDependencies()}>
        <div class={styles.title}>Dependencies</div>
        <div class={styles.dependencies}>
          <For each={Object.keys(dependencies())}>
            {dependency => <PackageItem name={dependency} version={dependencies()[dependency]}/>}
          </For>
        </div>
        <div class={styles.title}>Dev Dependencies</div>
        <div class={styles.dependencies}>
          <For each={Object.keys(devDependencies())}>
            {dependency => <PackageItem name={dependency} version={devDependencies()[dependency]}/>}
          </For>
        </div>
      </Show>
    </div>
  )
}

const PackageItem = (props: {name: string, version: string}) => {
  return (
    <div class={styles.package}>
      <div class={styles.name}>{props.name}</div>
      <div class={styles.version}>{props.version}</div>
    </div>
  )
}

export default App
