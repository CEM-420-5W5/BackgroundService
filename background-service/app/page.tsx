"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { MyLoginView } from "./my-login-view"
import { BorderedContainer } from "./bordered-container"
import { MyHubConnection } from "./my-hub-connection"
//import { Button } from "ui-exercices-5w5"
//import { BorderedContainer, LoginView } from "ui-exercices-5w5"

/*const LoginView = dynamic(
  () => import("ui-exercices-5w5").then(mod => ({ default: mod.LoginView })),
  { ssr: false }
)*/

const serverUrl = "http://localhost:5080/"
const loginUrl = serverUrl + "api/Account"
const hubUrl = serverUrl + "game"

export default function Home() {
  const handleClick = () => {
    console.log("Button clicked!")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 p-2">Background Service</h1>
      <div className="p-2 max-w-[700px]">
        <MyLoginView apiUrl={loginUrl} />
        <MyHubConnection apiUrl={hubUrl} />
        <BorderedContainer className="p-2 mt-2">
          <div>Something</div>
        </BorderedContainer>
      </div>
    </div>
  );
}
