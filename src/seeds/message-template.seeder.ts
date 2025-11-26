import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'

import { MessageTemplate } from 'src/message/entities'
import { MessageChannel, MessageType } from 'src/message/dto'
export class MessageTemplateSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const messageTemplateRepository = dataSource.getRepository(MessageTemplate)

    const recordCount = await messageTemplateRepository.count()
    if (recordCount > 0) {
      console.log('Message templates already seeded.')
      return
    }

    const messageTemplates = [
      {
        channel: MessageChannel.EMAIL,
        type: MessageType.QUOTATION,
        subject: '',
        content: `
        <!DOCTYPE html>
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <title></title>
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style type="text/css">
              #outlook a {
                padding: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              table,
              td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
              }
              img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              p {
                display: block;
                margin: 13px 0;
              }
            </style>
            <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG />
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
            <![endif]-->
            <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix {
                  width: 100% !important;
                }
              </style>
            <![endif]-->

            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Open+Sans:400,700"
              rel="stylesheet"
              type="text/css"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
              rel="stylesheet"
              type="text/css"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Cabin:400,700"
              rel="stylesheet"
              type="text/css"
            />
            <style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
              @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
              @import url(https://fonts.googleapis.com/css?family=Cabin:400,700);
            </style>
            <!--<![endif]-->

            <style type="text/css">
              @media only screen and (min-width: 480px) {
                .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100%;
                }
              }
            </style>
            <style media="screen and (min-width:480px)">
              .moz-text-html .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            </style>

            <style type="text/css">
              @media only screen and (max-width: 479px) {
                table.mj-full-width-mobile {
                  width: 100% !important;
                }
                td.mj-full-width-mobile {
                  width: auto !important;
                }
              }
            </style>
            <style type="text/css">
              .hide_on_mobile {
                display: none !important;
              }
              @media only screen and (min-width: 480px) {
                .hide_on_mobile {
                  display: block !important;
                }
              }
              .hide_section_on_mobile {
                display: none !important;
              }
              @media only screen and (min-width: 480px) {
                .hide_section_on_mobile {
                  display: table !important;
                }

                div.hide_section_on_mobile {
                  display: block !important;
                }
              }
              .hide_on_desktop {
                display: block !important;
              }
              @media only screen and (min-width: 480px) {
                .hide_on_desktop {
                  display: none !important;
                }
              }
              .hide_section_on_desktop {
                display: table !important;
                width: 100%;
              }
              @media only screen and (min-width: 480px) {
                .hide_section_on_desktop {
                  display: none !important;
                }
              }

              p,
              h1,
              h2,
              h3 {
                margin: 0px;
              }

              ul,
              li,
              ol {
                font-size: 11px;
                font-family: Ubuntu, Helvetica, Arial;
              }

              a {
                text-decoration: none;
                color: inherit;
              }

              @media only screen and (max-width: 480px) {
                .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100% !important;
                }
                .mj-column-per-100 > .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100% !important;
                }
              }
            </style>
          </head>
          <body style="word-spacing: normal; background-color: #ffffff">
            <div style="background-color: #ffffff">
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

              <div
                style="
                  background: #ffffff;
                  background-color: #ffffff;
                  margin: 0px auto;
                  max-width: 600px;
                "
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background: #ffffff; background-color: #ffffff; width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 20px 0px 20px 0px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->

                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="
                            font-size: 0px;
                            text-align: left;
                            direction: ltr;
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align: top"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  style="
                                    font-size: 0px;
                                    padding: 0px 0px 0px 0px;
                                    word-break: break-word;
                                  "
                                >
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tbody>
                                      <tr>
                                        <td style="width: 127px">
                                          <img
                                            src="https://storage.googleapis.com/topolio50728/plugin-assets/6320/50728/Logo-GS1-Bolivia.png"
                                            style="
                                              border: 0;
                                              border-radius: 0px 0px 0px 0px;
                                              display: block;
                                              outline: none;
                                              text-decoration: none;
                                              height: auto;
                                              width: 100%;
                                              font-size: 13px;
                                            "
                                            width="127"
                                            height="auto"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          border-bottom: 2px #cfcfcf solid;
                          border-top: 2px #cfcfcf solid;
                          direction: ltr;
                          font-size: 0px;
                          padding: 10px 0px 10px 0px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->

                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="
                            font-size: 0px;
                            text-align: left;
                            direction: ltr;
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align: top"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="left"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 15px 5px 15px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Ubuntu, Helvetica, Arial, sans-serif;
                                      font-size: 13px;
                                      line-height: 1.5;
                                      text-align: left;
                                      color: #000000;
                                    "
                                  >
                                    <h1
                                      style="
                                        font-family: 'Cabin', sans-serif;
                                        font-size: 22px;
                                        font-weight: bold;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          font-size: 19px;
                                        "
                                        ><span style="color: rgb(37, 77, 120)"
                                          >Estimado
                                          $$quotation.historical_company.name$$,</span
                                        ></span
                                      >
                                    </h1>
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  align="left"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 15px 15px 15px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Ubuntu, Helvetica, Arial, sans-serif;
                                      font-size: 13px;
                                      line-height: 1.8;
                                      text-align: left;
                                      color: #000000;
                                    "
                                  >
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          font-size: 14px;
                                        "
                                        ><span style="color: rgb(114, 114, 114)"
                                          >Gracias por su interés en adquirir nuestros
                                          productos y servicios.</span
                                        ></span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                        >En la parte inferior de este correo electrónico
                                        encontrará adjunta la cotización en PDF, 
                                        emitida el $$quotation.created_at$$.</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                        >Puede realizar el pago de esta cotización por
                                        los siguientes medios:</span
                                      >
                                    </p>
                                    <ul
                                      style="
                                        font-size: 11px;
                                        font-family: Ubuntu, Helvetica, Arial;
                                      "
                                    >
                                      <li
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                      >
                                        <span
                                          style="
                                            font-size: 14px;
                                            font-family: 'Open Sans', sans-serif;
                                            color: rgb(114, 114, 114);
                                          "
                                          >Transferencia o Depósito Bancario a una de
                                          las siguientes cuentas:</span
                                        >
                                        <ul
                                          style="
                                            font-size: 11px;
                                            font-family: Ubuntu, Helvetica, Arial;
                                          "
                                        >
                                          <li
                                            style="
                                              font-family: 'Open Sans', sans-serif;
                                              font-size: 14px;
                                            "
                                          >
                                            <span
                                              style="
                                                font-size: 14px;
                                                font-family: 'Open Sans', sans-serif;
                                                color: rgb(114, 114, 114);
                                              "
                                              >Banco Ganadero 110032456 Moneda
                                              Nacional</span
                                            >
                                          </li>
                                          <li
                                            style="
                                              font-family: 'Open Sans', sans-serif;
                                              font-size: 14px;
                                            "
                                          >
                                            <span
                                              style="
                                                font-size: 14px;
                                                font-family: 'Open Sans', sans-serif;
                                                color: rgb(114, 114, 114);
                                              "
                                              >Banco Ganadero 110032456 Moneda
                                              Extranjera</span
                                            >
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                        >Una vez realizado el pago, deberá presentar el
                                        o los comprobantes en las oficinas de GS1
                                        Bolivia para finalizar la compra.</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                        >Atentamente,</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                      "
                                    >
                                      <span
                                        style="
                                          font-size: 14px;
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(114, 114, 114);
                                        "
                                        >El equipo de GS1 Bolivia.</span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 0px 0px 45px 0px;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->

                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="
                            font-size: 0px;
                            text-align: left;
                            direction: ltr;
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align: top"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="left"
                                  style="
                                    font-size: 0px;
                                    padding: 15px 15px 15px 15px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Ubuntu, Helvetica, Arial, sans-serif;
                                      font-size: 13px;
                                      line-height: 1.5;
                                      text-align: left;
                                      color: #000000;
                                    "
                                  >
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                        text-align: center;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(154, 154, 154);
                                          font-size: 14px;
                                        "
                                        >Av: Las Americas No. 7, Edif. CAINCO, Casilla
                                        180 Santa Cruz - Bolivia</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                        text-align: center;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(154, 154, 154);
                                          font-size: 14px;
                                        "
                                        >Tel:  (591-3) 338-3361 / 333-4555</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                        text-align: center;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(154, 154, 154);
                                          font-size: 14px;
                                        "
                                        >Fax: (591-3) 334-2353</span
                                      >
                                    </p>
                                    <p
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial;
                                        font-size: 11px;
                                        text-align: center;
                                      "
                                    >
                                      <span
                                        style="
                                          font-family: 'Open Sans', sans-serif;
                                          color: rgb(154, 154, 154);
                                          font-size: 14px;
                                        "
                                        >Email: gs1@gs1.org.bo</span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!--[if mso | IE]></td></tr></table><![endif]-->
            </div>
          </body>
        </html>
`,
      },
    ]
    await messageTemplateRepository.insert(messageTemplates)

    console.log('Message Templates seeder executed successfully.')
  }
}
