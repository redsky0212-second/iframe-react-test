import { useMemo, useState, type ReactNode } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, IRowNode } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

type OrderStatus = '처리중' | '완료' | '취소';
type Category = '전자기기' | '의류' | '식품' | '가구' | '도서';

interface Order {
	orderId: string;
	customer: string;
	category: Category;
	product: string;
	quantity: number;
	amount: number;
	orderDate: string;
	status: OrderStatus;
}

const ALL_ORDERS: Order[] = [
	{ orderId: 'ORD-0001', customer: '김민준', category: '전자기기', product: '무선 이어폰', quantity: 1, amount: 89000, orderDate: '2024-03-01', status: '완료' },
	{ orderId: 'ORD-0002', customer: '이서연', category: '의류', product: '린넨 셔츠', quantity: 2, amount: 58000, orderDate: '2024-03-03', status: '완료' },
	{ orderId: 'ORD-0003', customer: '박지호', category: '식품', product: '유기농 원두 500g', quantity: 3, amount: 42000, orderDate: '2024-03-05', status: '처리중' },
	{ orderId: 'ORD-0004', customer: '최수아', category: '가구', product: '원목 책상', quantity: 1, amount: 320000, orderDate: '2024-03-07', status: '처리중' },
	{ orderId: 'ORD-0005', customer: '정도윤', category: '도서', product: '리액트 완벽 가이드', quantity: 1, amount: 32000, orderDate: '2024-03-08', status: '완료' },
	{ orderId: 'ORD-0006', customer: '강하은', category: '전자기기', product: '스마트 워치', quantity: 1, amount: 250000, orderDate: '2024-03-10', status: '취소' },
	{ orderId: 'ORD-0007', customer: '윤서준', category: '의류', product: '데님 자켓', quantity: 1, amount: 95000, orderDate: '2024-03-11', status: '완료' },
	{ orderId: 'ORD-0008', customer: '임지우', category: '식품', product: '견과류 믹스 1kg', quantity: 2, amount: 38000, orderDate: '2024-03-12', status: '처리중' },
	{ orderId: 'ORD-0009', customer: '한소율', category: '가구', product: '패브릭 소파', quantity: 1, amount: 580000, orderDate: '2024-03-13', status: '처리중' },
	{ orderId: 'ORD-0010', customer: '오예진', category: '도서', product: '타입스크립트 핸드북', quantity: 2, amount: 54000, orderDate: '2024-03-14', status: '완료' },
	{ orderId: 'ORD-0011', customer: '신건우', category: '전자기기', product: '기계식 키보드', quantity: 1, amount: 135000, orderDate: '2024-03-15', status: '완료' },
	{ orderId: 'ORD-0012', customer: '배나연', category: '의류', product: '캐시미어 니트', quantity: 1, amount: 128000, orderDate: '2024-03-17', status: '취소' },
	{ orderId: 'ORD-0013', customer: '조현우', category: '식품', product: '제주 감귤 5kg', quantity: 1, amount: 29000, orderDate: '2024-03-18', status: '완료' },
	{ orderId: 'ORD-0014', customer: '황지민', category: '가구', product: '높이조절 책상', quantity: 1, amount: 420000, orderDate: '2024-03-20', status: '처리중' },
	{ orderId: 'ORD-0015', customer: '류승현', category: '도서', product: '클린 코드', quantity: 1, amount: 28000, orderDate: '2024-03-21', status: '완료' },
	{ orderId: 'ORD-0016', customer: '노은지', category: '전자기기', product: '노이즈 캔슬링 헤드셋', quantity: 1, amount: 310000, orderDate: '2024-03-22', status: '처리중' },
	{ orderId: 'ORD-0017', customer: '문태양', category: '의류', product: '울 코트', quantity: 1, amount: 215000, orderDate: '2024-03-23', status: '완료' },
	{ orderId: 'ORD-0018', customer: '심예원', category: '식품', product: '그린티 40입', quantity: 4, amount: 52000, orderDate: '2024-03-24', status: '취소' },
];

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
	처리중: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
	완료: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
	취소: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
};

const statusCellRenderer = (params: { value: OrderStatus }) => {
	const cfg = STATUS_CONFIG[params.value];
	return (
		<span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
			<span className={`size-1.5 rounded-full ${cfg.dot}`} />
			{params.value}
		</span>
	);
};

const amountCellRenderer = (params: { value: number }) => (
	<span className="font-medium tabular-nums">{params.value.toLocaleString('ko-KR')}원</span>
);

const CATEGORIES: Category[] = ['전자기기', '의류', '식품', '가구', '도서'];
const STATUSES: OrderStatus[] = ['처리중', '완료', '취소'];

export default function SecondPage(): ReactNode {
	const [keyword, setKeyword] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
	const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');

	const filteredData = useMemo(() => {
		return ALL_ORDERS.filter((row) => {
			if (selectedStatus && row.status !== selectedStatus) return false;
			if (selectedCategory && row.category !== selectedCategory) return false;
			if (dateFrom && row.orderDate < dateFrom) return false;
			if (dateTo && row.orderDate > dateTo) return false;
			if (keyword) {
				const kw = keyword.toLowerCase();
				return (
					row.orderId.toLowerCase().includes(kw) ||
					row.customer.includes(kw) ||
					row.product.toLowerCase().includes(kw)
				);
			}
			return true;
		});
	}, [keyword, selectedStatus, selectedCategory, dateFrom, dateTo]);

	const totalAmount = useMemo(
		() => filteredData.reduce((sum, r) => sum + r.amount * r.quantity, 0),
		[filteredData],
	);

	const colDefs = useMemo<ColDef<Order>[]>(
		() => [
			{ field: 'orderId', headerName: '주문번호', width: 120 },
			{ field: 'customer', headerName: '고객명', width: 100 },
			{ field: 'category', headerName: '카테고리', width: 110 },
			{ field: 'product', headerName: '상품명', flex: 1, minWidth: 160 },
			{ field: 'quantity', headerName: '수량', width: 80, type: 'numericColumn' },
			{
				field: 'amount',
				headerName: '금액',
				width: 140,
				type: 'numericColumn',
				cellRenderer: amountCellRenderer,
			},
			{ field: 'orderDate', headerName: '주문일', width: 120, sort: 'desc' },
			{
				field: 'status',
				headerName: '상태',
				width: 100,
				cellRenderer: statusCellRenderer,
			},
		],
		[],
	);

	const defaultColDef = useMemo<ColDef>(
		() => ({ sortable: true, resizable: true, filter: true }),
		[],
	);

	const isExternalFilterPresent = () => true;

	const doesExternalFilterPass = (node: IRowNode<Order>) => {
		if (!node.data) return true;
		const { status, category, orderDate } = node.data;
		if (selectedStatus && status !== selectedStatus) return false;
		if (selectedCategory && category !== selectedCategory) return false;
		if (dateFrom && orderDate < dateFrom) return false;
		if (dateTo && orderDate > dateTo) return false;
		return true;
	};

	const onGridReady = (params: GridReadyEvent) => {
		params.api.sizeColumnsToFit();
	};

	const handleReset = () => {
		setKeyword('');
		setSelectedStatus('');
		setSelectedCategory('');
		setDateFrom('');
		setDateTo('');
	};

	const hasFilter = keyword || selectedStatus || selectedCategory || dateFrom || dateTo;

	const statusSummary = useMemo(
		() =>
			STATUSES.map((s) => ({
				label: s,
				count: filteredData.filter((r) => r.status === s).length,
				cfg: STATUS_CONFIG[s],
			})),
		[filteredData],
	);

	return (
		<div className="max-w-5xl space-y-5">
			{/* 헤더 */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<span className="inline-block w-1 h-5 rounded-full bg-violet-500" />
						<h1 className="text-xl font-semibold tracking-tight">주문 관리</h1>
					</div>
					<p className="text-sm text-gray-400 pl-3">조건 검색 및 AG Grid 기반 주문 목록 조회</p>
				</div>

				{/* 상태별 요약 */}
				<div className="flex items-center gap-2 shrink-0">
					<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
						전체 <strong className="text-slate-800">{filteredData.length}</strong>
					</span>
					{statusSummary.map(({ label, count, cfg }) => (
						<span
							key={label}
							className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
						>
							{label} <strong>{count}</strong>
						</span>
					))}
				</div>
			</div>

			{/* 검색 조건 패널 */}
			<div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 shadow-sm">
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
					{/* 키워드 */}
					<div className="col-span-2 md:col-span-2">
						<label className="mb-1 block text-xs font-medium text-gray-500">키워드</label>
						<div className="relative">
							<svg
								className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
								fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
							</svg>
							<input
								type="text"
								placeholder="주문번호, 고객명, 상품명..."
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
							/>
						</div>
					</div>

					{/* 상태 */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500">주문 상태</label>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | '')}
							className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
						>
							<option value="">전체</option>
							{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
						</select>
					</div>

					{/* 카테고리 */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500">카테고리</label>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value as Category | '')}
							className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
						>
							<option value="">전체</option>
							{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
						</select>
					</div>

					{/* 기간 from */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500">주문일 시작</label>
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
						/>
					</div>

					{/* 기간 to */}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-500">주문일 종료</label>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
						/>
					</div>

					{/* 버튼 영역 */}
					<div className="col-span-2 flex items-end justify-end gap-2">
						{hasFilter && (
							<button
								onClick={handleReset}
								className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition"
							>
								초기화
							</button>
						)}
						<div className="flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-100 px-4 py-2 text-sm text-violet-700">
							<span>총 금액</span>
							<strong className="tabular-nums">{totalAmount.toLocaleString('ko-KR')}원</strong>
						</div>
					</div>
				</div>
			</div>

			{/* 그리드 */}
			<div
				className="ag-theme-quartz overflow-hidden rounded-xl border border-gray-200 shadow-sm"
				style={{ height: 460 }}
			>
				<AgGridReact
					rowData={filteredData}
					columnDefs={colDefs}
					defaultColDef={defaultColDef}
					pagination={true}
					paginationPageSize={10}
					paginationPageSizeSelector={[10, 20, 50]}
					isExternalFilterPresent={isExternalFilterPresent}
					doesExternalFilterPass={doesExternalFilterPass}
					onGridReady={onGridReady}
					animateRows={true}
					noRowsOverlayComponent={() => (
						<div className="flex flex-col items-center gap-2 text-gray-400 py-12">
							<svg className="size-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
							</svg>
							<p className="text-sm">검색 결과가 없습니다.</p>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
