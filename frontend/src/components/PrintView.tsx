import React, { useState, useMemo, useRef } from 'react';
import { X, Printer, Table, Grid3X3 } from 'lucide-react';

interface PrintViewProps {
    maxNumber: number;
    numberOwners: Map<number, 'p1' | 'p2'>;
    onClose: () => void;
}

const CARD_SIZE = 25; // 5x5 bingo card

const PrintView: React.FC<PrintViewProps> = ({ maxNumber, numberOwners, onClose }) => {
    const [printMode, setPrintMode] = useState<'table' | 'cards'>('table');
    const printRef = useRef<HTMLDivElement>(null);

    // Generate all numbers
    const allNumbers = useMemo(() =>
        Array.from({ length: maxNumber }, (_, i) => i + 1),
        [maxNumber]
    );

    // Generate bingo cards
    const bingoCards = useMemo(() => {
        const cards: { id: number; numbers: number[] }[] = [];
        for (let i = 0; i < maxNumber; i += CARD_SIZE) {
            const chunk = Array.from(
                { length: Math.min(CARD_SIZE, maxNumber - i) },
                (_, j) => i + j + 1
            );
            cards.push({ id: i / CARD_SIZE + 1, numbers: chunk });
        }
        return cards;
    }, [maxNumber]);

    // Calculate optimal grid columns for table mode based on total numbers
    const tableGridCols = useMemo(() => {
        if (maxNumber <= 50) return 5;
        if (maxNumber <= 100) return 10;
        if (maxNumber <= 200) return 10;
        if (maxNumber <= 300) return 15;
        if (maxNumber <= 500) return 20;
        return 25;
    }, [maxNumber]);

    // Calculate cell size class based on total numbers
    const cellSizeClass = useMemo(() => {
        if (maxNumber <= 50) return 'text-xl p-3';
        if (maxNumber <= 100) return 'text-base p-2';
        if (maxNumber <= 200) return 'text-xs p-1.5';
        if (maxNumber <= 300) return 'text-[10px] p-1';
        if (maxNumber <= 500) return 'text-[9px] p-0.5';
        return 'text-[8px] p-0.5';
    }, [maxNumber]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800 p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <h3 className="font-black flex items-center gap-2 text-brand-purple dark:text-brand-gold uppercase tracking-widest text-sm">
                        <Printer size={18} /> Imprimir
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="p-6 pb-0 shrink-0">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setPrintMode('table')}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${printMode === 'table'
                                    ? 'border-brand-purple bg-brand-purple/10 text-brand-purple'
                                    : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'
                                }`}
                        >
                            <Table size={16} /> Tabela completa
                        </button>
                        <button
                            onClick={() => setPrintMode('cards')}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${printMode === 'cards'
                                    ? 'border-brand-magenta bg-brand-magenta/10 text-brand-magenta'
                                    : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200'
                                }`}
                        >
                            <Grid3X3 size={16} /> Cartelas de bingo
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-widest text-center">
                        {maxNumber} números • {printMode === 'table' ? '1 página' : `${Math.ceil(bingoCards.length / 4)} página(s)`}
                    </p>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 print-preview-container">
                        <div ref={printRef}>
                            {printMode === 'table' ? (
                                /* ===== TABLE MODE ===== */
                                <div id="print-content-area">
                                    <div className="print-header text-center mb-4">
                                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Bingo2Gether — Tabela de Números</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            Números de 1 a {maxNumber} • {new Date().toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div
                                        className="print-table-grid"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${tableGridCols}, 1fr)`,
                                            gap: maxNumber > 300 ? '1px' : '2px',
                                            width: '100%',
                                        }}
                                    >
                                        {allNumbers.map(num => {
                                            const owner = numberOwners.get(num);
                                            return (
                                                <div
                                                    key={num}
                                                    className={`
                            border border-slate-200 text-center font-bold ${cellSizeClass}
                            ${owner === 'p1' ? 'bg-slate-100 line-through text-slate-400' : ''}
                            ${owner === 'p2' ? 'bg-slate-100 line-through text-slate-400' : ''}
                            ${!owner ? 'text-slate-700' : ''}
                          `}
                                                    style={{ aspectRatio: maxNumber > 200 ? 'auto' : '1' }}
                                                >
                                                    {num}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="print-footer text-center mt-3">
                                        <p className="text-[8px] text-slate-300 uppercase tracking-widest">
                                            ✓ = já sorteado • Marque os números sorteados com caneta
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* ===== CARDS MODE ===== */
                                <div id="print-content-area">
                                    <div className="print-header text-center mb-4">
                                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Bingo2Gether — Cartelas</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {bingoCards.length} cartelas • {new Date().toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="print-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                        {bingoCards.map(card => (
                                            <div key={card.id} className="border-2 border-slate-800 rounded-lg p-3 break-inside-avoid">
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center border-b border-slate-200 pb-1">
                                                    <span>Cartela #{card.id}</span>
                                                    <span className="text-slate-300">Bingo2Gether</span>
                                                </div>
                                                <div
                                                    className="grid gap-[2px]"
                                                    style={{ gridTemplateColumns: `repeat(5, 1fr)` }}
                                                >
                                                    {card.numbers.map(num => {
                                                        const owner = numberOwners.get(num);
                                                        return (
                                                            <div
                                                                key={num}
                                                                className={`
                                  aspect-square flex items-center justify-center border border-slate-300 text-sm font-bold
                                  ${owner ? 'bg-slate-100 line-through text-slate-400' : 'text-slate-700'}
                                `}
                                                            >
                                                                {num}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Print Button */}
                <div className="p-6 pt-2 shrink-0 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handlePrint}
                        className="w-full py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Printer size={20} /> Imprimir / Salvar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintView;
