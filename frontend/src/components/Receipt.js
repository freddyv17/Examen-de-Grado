import React from 'react';
import { X, Printer, Download } from 'lucide-react';

const Receipt = ({ sale, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-NI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Crear contenido HTML del recibo
    const receiptContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Recibo de Venta</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      .receipt { max-width: 400px; margin: 0 auto; }
      .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
      .logo { width: 80px; height: 80px; margin: 0 auto; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th, td { padding: 5px; text-align: left; }
      .total-row { border-top: 2px solid #000; font-weight: bold; }
      .footer { text-align: center; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(receiptContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header no imprimible */}
        <div className="flex justify-between items-center p-6 border-b bg-emerald-50 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900">Recibo de Venta</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              data-testid="print-receipt"
            >
              <Printer size={20} />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              data-testid="download-receipt"
            >
              <Download size={20} />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenido del recibo */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]" id="receipt-content">
          <div className="max-w-md mx-auto bg-white p-8 border-2 border-gray-300 rounded-lg">
            {/* Encabezado */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
              <div className="bg-emerald-50 w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="text-4xl font-bold text-emerald-600">M</div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MARIBEL FARMACIA</h1>
              <p className="text-sm text-gray-600 mt-1">Sistema de Inventario y Facturación</p>
              <p className="text-xs text-gray-500 mt-2">León, Nicaragua</p>
            </div>

            {/* Información de la venta */}
            <div className="mb-6 text-sm">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <span className="font-semibold">Recibo #:</span>
                  <p className="text-gray-700">{sale.id.substring(0, 12)}</p>
                </div>
                <div>
                  <span className="font-semibold">Fecha:</span>
                  <p className="text-gray-700">{formatDate(sale.created_at)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Cliente:</span>
                  <p className="text-gray-700">{sale.customer_name}</p>
                </div>
                <div>
                  <span className="font-semibold">Vendedor:</span>
                  <p className="text-gray-700">{sale.user_name}</p>
                </div>
              </div>
            </div>

            {/* Detalles de productos */}
            <div className="mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Producto</th>
                    <th className="text-center py-2">Cant.</th>
                    <th className="text-right py-2">Precio</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.details.map((detail, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{detail.product_name}</td>
                      <td className="text-center py-2">{detail.quantity}</td>
                      <td className="text-right py-2">C${detail.unit_price.toFixed(2)}</td>
                      <td className="text-right py-2 font-semibold">C${detail.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="mb-6 text-sm border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">C${sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.tax > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Impuesto:</span>
                  <span className="font-semibold">C${sale.tax.toFixed(2)}</span>
                </div>
              )}
              {sale.discount > 0 && (
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Descuento:</span>
                  <span className="font-semibold">-C${sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-2 mt-2">
                <span>TOTAL:</span>
                <span className="text-emerald-600">C${sale.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="mb-6 text-sm text-center bg-gray-50 p-3 rounded">
              <span className="font-semibold">Método de Pago: </span>
              <span className="uppercase">{sale.payment_method}</span>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 border-t border-dashed border-gray-300 pt-4">
              <p className="mb-2">¡Gracias por su compra!</p>
              <p>Maribel Farmacia - Su salud es nuestra prioridad</p>
              <p className="mt-2">Este documento es un comprobante de compra</p>
              <p className="mt-4 text-gray-400">Sistema desarrollado por Freddy Valencia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;
