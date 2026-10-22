import { DeskUILocaleProvider, ToastProvider } from "@deskui/ui";
import { lazy, Suspense } from "react";

import { I18nProvider, useI18n } from "./i18n/provider";
import { useHashRoute } from "./lib/router";

const DocsPage = lazy(() =>
	import("./pages/docs").then((module) => ({ default: module.DocsPage })),
);
const LabPage = lazy(() =>
	import("./pages/lab").then((module) => ({ default: module.LabPage })),
);

function LoadingScreen() {
	const { t } = useI18n();

	return (
		<div
			role="status"
			className="w95-ui flex min-h-dvh items-center justify-center bg-desktop p-4 text-ink"
		>
			<div className="bevel-window bg-surface px-4 py-2">
				{t("shell.loading")}
			</div>
		</div>
	);
}

function AppContent() {
	const route = useHashRoute();
	const { locale } = useI18n();
	const isLab = route === "/laboratorio" || route.startsWith("/laboratorio/");

	return (
		<DeskUILocaleProvider locale={locale}>
			<ToastProvider>
				<Suspense fallback={<LoadingScreen />}>
					{isLab ? <LabPage /> : <DocsPage route={route} />}
				</Suspense>
			</ToastProvider>
		</DeskUILocaleProvider>
	);
}

export default function App() {
	return (
		<I18nProvider>
			<AppContent />
		</I18nProvider>
	);
}
