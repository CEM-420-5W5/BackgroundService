"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Button } from "ui-exercices-5w5"
import { BorderedContainer } from "ui-exercices-5w5"

const LoginView = dynamic(
  () => import("ui-exercices-5w5").then(mod => ({ default: mod.LoginView })),
  { ssr: false }
)

export default function Home() {
  const handleClick = () => {
    console.log("Button clicked!")
  }

  return (
    <div>
      <h1>Background Service</h1>
      <Suspense fallback={<div>Chargement...</div>}>
        <LoginView apiUrl="http://localhost:5011/api/Account/" />
      </Suspense>
      <BorderedContainer className="m-4">
        <div>Something</div>
      </BorderedContainer>
    </div>
  );
}
