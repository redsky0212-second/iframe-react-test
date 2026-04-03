import { Outlet } from 'react-router';

interface IRootLayoutProps {
	//
}

export default function RootLayout({}: IRootLayoutProps): React.ReactNode {
	return (
		<div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
			<Outlet />
		</div>
	);
}
