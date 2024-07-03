import { createSignal, For, Show } from 'solid-js'
import styles from './App.module.css'
import { createStore } from 'solid-js/store'
import { A, useMatch, useParams } from '@solidjs/router'


interface Project {
  id: string
  name: string
  path: string
}

const [projects, setProjects] = createStore<Record<string, Project>>({
  "1": {
    id: "1",
    name: 'nerimity-web',
    path: "E:\\Nerimity\\nerimity-web\\"
  }
})

const Drawer = () => {
  const projectArray = () => Object.values(projects);

  return (
    <div class={styles.drawer}>
      <For each={projectArray()}>
        {project => <A href={`/${project.id}`}>{project.name}</A>}
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

export default App
