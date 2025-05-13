import { createSignal, For, Show } from "solid-js"

import "./App.css"
import { Conversation, type Status, type Mode } from "@11labs/client"
import { Bars, Puff, TailSpin } from "solid-spinner"

function App() {
	const [conversation, setConversation] = createSignal<Conversation>()
	const [status, setStatus] = createSignal<Status>("disconnected")
	const [mode, setMode] = createSignal<Mode>("listening")
	const [messages, setMessages] = createSignal<
		{
			message: string
			source: string
		}[]
	>([])

	return (
		<>
			<header>
				<h1>Voxa</h1>
				<p>A voice assistant for CSE 100</p>
			</header>
			<Show
				when={!!conversation()}
				fallback={
					<div>
						<button
							onClick={async () => {
								setMessages([])
								setConversation(
									await Conversation.startSession({
										agentId: "QSqX8p3ZVHVGFGcahwrS",
										onDisconnect: () => {
											console.log("Disconnected")
											setConversation(undefined)
											setStatus("disconnected")
											setMode("listening")
										},
										onStatusChange(prop) {
											setStatus(prop.status)
										},
										onModeChange(prop) {
											setMode(prop.mode)
										},
										onMessage(props) {
											setMessages((messages) => [...messages, props])
										},
										onError(message) {
											console.error(message)
										},
									})
								)
							}}>
							New Voice Chat
						</button>
						<p>
							<small>Only accepts 10 voice chats per day. This is a demo for CSE 100.</small>
						</p>
					</div>
				}>
				<div>
					<Show
						when={status() === "connected"}
						fallback={
							<button>
								{status().toLocaleUpperCase()}
								<TailSpin style={{ width: "20px", height: "20px" }} />
							</button>
						}>
						{mode() === "speaking" ? (
							<p>
								Speaking <Bars style={{ width: "20px", height: "20px" }} />
								<small>Talk to interrupt</small>
							</p>
						) : (
							<p>
								Listening <Puff style={{ width: "20px", height: "20px" }} />
							</p>
						)}
						<button onClick={() => conversation()?.endSession()}>End Chat</button>
					</Show>
					<ul>
						<For each={messages()}>
							{(m) => (
								<li>
									<strong>{m.source.toLocaleUpperCase()}:</strong> {m.message}
								</li>
							)}
						</For>
					</ul>
				</div>
			</Show>
		</>
	)
}

export default App
