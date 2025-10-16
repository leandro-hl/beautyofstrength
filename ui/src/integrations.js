/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export async function setupMercadoPago() {
    const mp = new MercadoPago("MERCADO_PAGO_ID", {
        locale: 'es'
    });
    const bricksBuilder = mp.bricks();
    const renderPaymentBrick = async (bricksBuilder) => {
        const settings = {
            initialization: {
                /*
                  "amount" es el monto total a pagar por todos los medios de pago con excepción de la Cuenta de Mercado Pago y Cuotas sin tarjeta de crédito, las cuales tienen su valor de procesamiento determinado en el backend a través del "preferenceId"
                */
                amount: 5000,
                preferenceId: "<PREFERENCE_ID>",
                payer: {
                    firstName: "",
                    lastName: "",
                    email: "",
                },
            },
            customization: {
                visual: {
                    style: {
                        theme: "default",
                    },
                },
                paymentMethods: {
                    creditCard: "all",
                    debitCard: "all",
                    ticket: "all",
                    bankTransfer: "all",
                    atm: "all",
                    onboarding_credits: "all",
                    wallet_purchase: "all",
                    maxInstallments: 1
                },
            },
            callbacks: {
                onReady: () => {
                    /*
                     Callback llamado cuando el Brick está listo.
                     Aquí puede ocultar cargamentos de su sitio, por ejemplo.
                    */
                },
                onSubmit: ({ selectedPaymentMethod, formData }) => {
                    // callback llamado al hacer clic en el botón de envío de datos
                    return new Promise((resolve, reject) => {
                        fetch("/process_payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formData),
                        })
                            .then((response) => response.json())
                            .then((response) => {
                                // recibir el resultado del pago
                                resolve();
                            })
                            .catch((error) => {
                                // manejar la respuesta de error al intentar crear el pago
                                reject();
                            });
                    });
                },
                onError: (error) => {
                    // callback llamado para todos los casos de error de Brick
                    console.error(error);
                },
            },
        };
        window.paymentBrickController = await bricksBuilder.create(
            "payment",
            "paymentBrick_container",
            settings
        );
    };
    await renderPaymentBrick(bricksBuilder);
}