
export interface ChartProps<DataType = any> extends PropsWithLabel {
    chartData: DataType[];
    unit: string;
    isFetching?: boolean;
    fetchFailed?: boolean;
}
