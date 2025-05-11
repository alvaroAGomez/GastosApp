import { ChartConfiguration } from 'chart.js';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';

const currencyPipe = new CustomCurrencyPipe();

export function getDoughnutChartOptions(
  total: number
): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.dataset.data[ctx.dataIndex];
            const pct = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${currencyPipe.transform(value)} (${pct}%)`;
          },
        },
      },
    },
  };
}

export function getPieChartOptions(): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const dataArr = Array.isArray(ctx.dataset.data)
              ? ctx.dataset.data
              : [];
            const total = dataArr.reduce((a: number, b: number) => a + b, 0);
            const value = ctx.dataset.data[ctx.dataIndex];
            const pct = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${currencyPipe.transform(value)} (${pct}%)`;
          },
        },
      },
    },
  };
}

export function getBarChartOptions(): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            currencyPipe.transform(ctx.parsed.y ?? ctx.parsed.x),
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 13 } } },
      y: {
        grid: { display: false },
        beginAtZero: true,
        ticks: { font: { size: 13 } },
      },
    },
  };
}
