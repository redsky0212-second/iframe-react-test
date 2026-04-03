import { useMemo, useState, type ReactNode } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Employee {
	name: string;
	position: string;
	team: string;
	joinDate: string;
	salary: number;
	status: 'Active' | 'Inactive';
}

const rowData: Employee[] = [
	{
		name: '김민준',
		position: 'Frontend Developer',
		team: 'Web',
		joinDate: '2021-03-15',
		salary: 5200000,
		status: 'Active',
	},
	{
		name: '이서연',
		position: 'Backend Developer',
		team: 'API',
		joinDate: '2020-07-01',
		salary: 5500000,
		status: 'Active',
	},
	{
		name: '박지호',
		position: 'UX Designer',
		team: 'Design',
		joinDate: '2022-01-10',
		salary: 4800000,
		status: 'Active',
	},
	{
		name: '최수아',
		position: 'DevOps Engineer',
		team: 'Infra',
		joinDate: '2019-11-20',
		salary: 6000000,
		status: 'Active',
	},
	{
		name: '정도윤',
		position: 'Product Manager',
		team: 'Product',
		joinDate: '2021-09-05',
		salary: 6500000,
		status: 'Active',
	},
	{
		name: '강하은',
		position: 'Data Engineer',
		team: 'Data',
		joinDate: '2023-02-28',
		salary: 5800000,
		status: 'Active',
	},
	{ name: '윤서준', position: 'QA Engineer', team: 'QA', joinDate: '2022-06-14', salary: 4500000, status: 'Inactive' },
	{
		name: '임지우',
		position: 'Frontend Developer',
		team: 'Web',
		joinDate: '2023-08-01',
		salary: 4700000,
		status: 'Active',
	},
	{
		name: '한소율',
		position: 'Backend Developer',
		team: 'API',
		joinDate: '2020-03-22',
		salary: 5300000,
		status: 'Active',
	},
	{
		name: '오예진',
		position: 'Data Analyst',
		team: 'Data',
		joinDate: '2021-12-07',
		salary: 5100000,
		status: 'Inactive',
	},
	{
		name: '신건우',
		position: 'Security Engineer',
		team: 'Infra',
		joinDate: '2022-09-19',
		salary: 5900000,
		status: 'Active',
	},
	{
		name: '배나연',
		position: 'UI Designer',
		team: 'Design',
		joinDate: '2023-04-11',
		salary: 4600000,
		status: 'Active',
	},
];

const statusCellRenderer = (params: { value: string }) => {
	const isActive = params.value === 'Active';
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
				isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
			}`}
		>
			{params.value}
		</span>
	);
};

const salaryCellRenderer = (params: { value: number }) => {
	return <span>{params.value.toLocaleString('ko-KR')} 원</span>;
};

export default function MainIndex(): ReactNode {
	const [quickFilter, setQuickFilter] = useState('');

	const colDefs = useMemo<ColDef<Employee>[]>(
		() => [
			{ field: 'name', headerName: '이름', width: 120, filter: true },
			{ field: 'position', headerName: '직책', flex: 1, filter: true },
			{ field: 'team', headerName: '팀', width: 110, filter: true },
			{ field: 'joinDate', headerName: '입사일', width: 120, filter: true, sort: 'asc' },
			{
				field: 'salary',
				headerName: '연봉',
				width: 160,
				filter: 'agNumberColumnFilter',
				cellRenderer: salaryCellRenderer,
			},
			{
				field: 'status',
				headerName: '상태',
				width: 100,
				filter: true,
				cellRenderer: statusCellRenderer,
			},
		],
		[],
	);

	const defaultColDef = useMemo<ColDef>(
		() => ({
			sortable: true,
			resizable: true,
			filter: true,
		}),
		[],
	);

	const onGridReady = (params: GridReadyEvent) => {
		params.api.sizeColumnsToFit();
	};

	const activeCount = rowData.filter((r) => r.status === 'Active').length;

	return (
		<div className="max-w-5xl space-y-5">
			{/* 헤더 */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<span className="inline-block w-1 h-5 rounded-full bg-blue-500" />
						<h1 className="text-xl font-semibold tracking-tight">직원 현황</h1>
					</div>
					<p className="text-sm text-gray-400 pl-3">
						ag-grid 기반 데이터 그리드 · 정렬 · 필터 · 검색 지원
					</p>
				</div>

				{/* 요약 배지 */}
				<div className="flex items-center gap-2 shrink-0">
					<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
						전체
						<strong className="text-slate-800">{rowData.length}</strong>
					</span>
					<span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
						재직
						<strong className="text-emerald-700">{activeCount}</strong>
					</span>
					<span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
						퇴직
						<strong className="text-red-600">{rowData.length - activeCount}</strong>
					</span>
				</div>
			</div>

			{/* 검색 바 */}
			<div className="flex items-center gap-2">
				<div className="relative">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
					</svg>
					<input
						type="text"
						placeholder="이름, 직책, 팀 검색..."
						value={quickFilter}
						onChange={(e) => setQuickFilter(e.target.value)}
						className="w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400"
					/>
				</div>
				{quickFilter && (
					<button
						onClick={() => setQuickFilter('')}
						className="rounded-md px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
					>
						초기화
					</button>
				)}
			</div>

			{/* 그리드 */}
			<div
				className="ag-theme-quartz overflow-hidden rounded-xl border border-gray-200 shadow-sm"
				style={{ height: 460 }}
			>
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					defaultColDef={defaultColDef}
					pagination={true}
					paginationPageSize={8}
					paginationPageSizeSelector={[8, 20, 50]}
					quickFilterText={quickFilter}
					onGridReady={onGridReady}
					animateRows={true}
				/>
			</div>

			{/* 기능 안내 */}
			<div className="flex flex-wrap gap-2">
				{[
					{ icon: '↕', text: '헤더 클릭 — 정렬' },
					{ icon: '⊟', text: '헤더 아이콘 — 필터' },
					{ icon: '⟷', text: '경계선 드래그 — 너비 조절' },
					{ icon: '⟶', text: '하단 — 페이지 이동' },
				].map(({ icon, text }) => (
					<span
						key={text}
						className="inline-flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-500"
					>
						<span className="text-gray-400">{icon}</span>
						{text}
					</span>
				))}
			</div>
		</div>
	);
}
