import type { TAppRoute } from '@/types/router';

// @company/mf-main 앱 페이지 가져오기
import MainIndex from '../pages/MainIndex';
import SecondPage from '../pages/SecondPage';

const routes: TAppRoute[] = [
	{
		path: '/',
		element: <MainIndex />,
		name: 'MainIndex',
	},
	{
		path: '/second',
		element: <SecondPage />,
		name: 'SecondPage',
	},
];

export default routes;
