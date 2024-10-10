import { ReactNode } from "react"

function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={
        "flex h-full flex-col items-center justify-center bg-gray-100 min-h-screen"
      }
    >
      <main
        className={
          "flex h-full w-full flex-1 flex-grow. flex-col items-center overflow-y-auto"
        }
      >
        <div
          className={"flex w-full max-w-[800px] flex-grow flex-col px-4 mt-8"}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
