const fs = require('fs');
const path = require('path');
const enviarCorreo = require('./gmail.controller');
const db = require('../models');
const Colaborador = db.colaborador;
const Usuario = db.usuario;
const Documento = db.documento;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const Handlebars = require('handlebars');

const fechaActual = new Date();
const diaActual = fechaActual.getDate();
const mesActual = fechaActual.getMonth() + 1;

const destinatariosNoCumpleanios = async () => {
    try {
        const diaActual = new Date().getDate();
        const mesActual = new Date().getMonth() + 1;

        const response = await Colaborador.findAll({
            attributes: ['nombre', 'correoElectronico'],
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fechaNacimiento')), { [Op.ne]: mesActual }),
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fechaNacimiento')), { [Op.ne]: diaActual })
                ]
            }
        });

        return response;
    } catch (error) {
        console.log(error);
        throw error; 
    }   
};



const destinatariosCumpleanios = async () => {
    try {
        const response = await Colaborador.findAll({
            attributes: ['nombre', 'correoElectronico'],
            where: {
                fechaNacimiento: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fechaNacimiento')), mesActual),
                        Sequelize.where(Sequelize.fn('DAY', Sequelize.col('fechaNacimiento')), diaActual)
                    ]
                }
            }
        });
        const destinatarios = response;
        return destinatarios;
    } catch (error) {
        console.log(error);
    }    
};

exports.notificarCumpleanios = async () => {
    try {
        const cumpleanieros = await destinatariosCumpleanios();
        if(cumpleanieros.length > 0){
            const noCumpleanieros = await destinatariosNoCumpleanios();
            let nombres = '';
            cumpleanieros.forEach((c, index) => {
                nombres += c.nombre;
                if (index < cumpleanieros.length - 1) {
                    nombres += ', ';
                }
            });
            noCumpleanieros.forEach(async (c) => {
                const templatePath = path.join(__dirname, '../emailTemplates/emailNoCumpleTemplate.html');
                const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
                const htmlContent = htmlTemplate.replace('{{ cumpleanieros }}', nombres)
                .replace('{{ nombre }}', c.nombre);
                await enviarCorreo(c.correoElectronico, 'Únete en esta celebración', htmlContent);
            });
            cumpleanieros.forEach(async (cumpleaniero) => {
                const templatePath = path.join(__dirname, '../emailTemplates/emailCumpleTemplate.html');
                const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
                const htmlContent = htmlTemplate.replace('{{ nombre }}', cumpleaniero.nombre);
                await enviarCorreo(cumpleaniero.correoElectronico, `Feliz Cumpleaños de parte de todo el equipo! ${cumpleaniero.nombre}`, htmlContent);
            });            
        }
    } catch (error) {
        console.log(error);
    }
};

const obtenerColaborador = async (idColaborador) => {
    try {
        const response = await Colaborador.findByPk(idColaborador, {
            include: [
                {
                    model: Colaborador,
                    as: 'supervisor',
                }
            ]
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

exports.notificarSolicitud = async (tipo, solicitud) => {

    try {
        const idColaborador = solicitud.idColaborador;
        const colaborador = await obtenerColaborador(idColaborador);
        const emailColaborador =  colaborador.correoElectronico;
        if(colaborador.supervisor !== null){
           const emailSupervisor =  colaborador.supervisor.correoElectronico;
           notificarSupervisor(tipo, colaborador, solicitud, emailSupervisor);
           notificarColaborador(tipo, colaborador,solicitud, emailColaborador);
        }else{
            notificarColaborador(tipo, colaborador,solicitud, emailColaborador);
        }
    } catch (error) {
        console.log(error);
    }
}

const prepareHtmlContent = (titulo, nombreDestino, mensaje, solicitud, colaborador) => {

    const templatePath = path.join(__dirname, '../emailTemplates/emailSolicitudTemplate.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = htmlTemplate
    .replace('{{ titulo }}', titulo)
    .replace('{{ mensaje }}', mensaje)
    .replace('{{ idSolicitud }}', solicitud.idSolicitud)
    .replace('{{ nombre }}', nombreDestino)
    .replace('{{ fechaSolicitud }}', moment(solicitud.fechaSolicitud, 'YYYY-MM-DD').format('DD-MM-YYYY'))
    .replace('{{ idSolicitud }}', solicitud.idSolicitud)
    .replace('{{ tipoSolicitud }}', solicitud.tipoSolicitud)
    .replace('{{ estado }}', solicitud.estado)
    .replace('{{ asunto }}', solicitud.asunto ?? 'NO INDICA')
    .replace('{{ comentarioTalentoHumano }}', solicitud.comentarioTalentoHumano ?? 'NO INDICA COMENTARIOS')
    .replace('{{ nombreColaborador }}', colaborador.nombre)
    .replace('{{ fechaInicio }}', moment(solicitud.fechaInicio, 'YYYY-MM-DD').format('DD-MM-YYYY'))
    .replace('{{ fechaFin }}', moment(solicitud.fechaFin, 'YYYY-MM-DD').format('DD-MM-YYYY'))
    .replace('{{ horaInicio }}', solicitud.horaInicio ?? 'NO INDICA')
    .replace('{{ horaFin }}', solicitud.horaFin  ?? 'NO INDICA')
    .replace('{{ sustitucion }}', solicitud.sustitucion  ?? 'NO INDICA')
    .replace('{{ goce }}', solicitud.conGoceSalarial ? 'SÍ' : 'NO')
    .replace('{{ nombreSustituto }}', solicitud.nombreSustituto  ?? 'NO INDICA');

    return htmlContent;
}

const notificarSupervisor = async (tipo, colaborador, solicitud, correoSupervisor) => {
    const mensaje = tipo === 'nueva' ? 'Se ha ingresado la siguiente solicitud:' : 'La siguiente solicitud se ha procesado:';
    const titulo = tipo === 'nueva' ? 'Nueva Solicitud' : 'Solicitud actualizada';
    const htmlContent = prepareHtmlContent(titulo, colaborador.supervisor.nombre, mensaje, solicitud, colaborador);
    await enviarCorreo(correoSupervisor, 'SOLICITUD #'+solicitud.idSolicitud + ' - '+ colaborador.nombre, htmlContent);
}

const notificarColaborador = async (tipo, colaborador, solicitud, correoColaborador) => {
    const date = new Date();
    const mensaje = tipo === 'nueva' ? 'La siguiente solicitud ha sido registrada de manera satisfactoria:' : 'El estado de tu solicitud ha sido actualizado';
    const asunto = tipo === 'nueva' ? `Confirmación de registro de solicitud ${date}` : `Solicitud N#${solicitud.idSolicitud} ha sido procesada - ${date}`;
    const titulo = tipo === 'nueva' ? 'Nueva Solicitud' : 'Solicitud actualizada';
    const htmlContent = prepareHtmlContent(titulo, colaborador.nombre, mensaje, solicitud, colaborador);
    await enviarCorreo(correoColaborador, asunto, htmlContent);
}

const documentos = async () => {
    try {
        const diasLimites = [0, 1, 3, 7, 15];
        const docs = []; 
        for (const dias of diasLimites) {
            const fechaLimite = moment().add(dias, 'days').startOf('day');
            const documentos = await Documento.findAll({
                where: {
                    fechaVencimiento: fechaLimite.toDate(),
                },
                attributes: {
                    exclude: ['archivo']
                },
                include : [{
                    model: Colaborador,
                    as: 'colaborador',
                    attributes: ['nombre']
                }]
            });
            documentos.forEach((doc) => {
                docs.push({
                    idDocumento: doc.idDocumento,
                    tipo: doc.licencia ? 'Licencia' : 'Curso',
                    fechaVencimiento: moment(doc.fechaVencimiento, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    nombre: doc.licencia ?? doc.curso,
                    colaborador: doc.colaborador.nombre,
                    venceEn: dias === 0 ? 'Vencido' : (dias === 1 ? '1 día' : `${dias} días`)
                });
            });
        }
        return docs;
    } catch (error) {
        console.log(error);
    }
}


exports.documentosPorVencer = async () => {
    try {
        const response = await documentos();
        const docs = response;
        enviarDocumentosPorVencer(docs);
    } catch (error) {
        console.log(error);
    }
}

const obtenerAdminEmails = async () => {
    try {
        const emails = [];
        const response = await Usuario.findAll({
            where:{
                rol: 'admin'
            },
            include: [
                {
                    model: Colaborador,
                    as: 'colaborador',
                    attributes: ['nombre', 'correoElectronico', 'estado'],
                }
            ]
        });
        const usuarios = response;
        usuarios.forEach((usuario) => {
            if(usuario.colaborador.estado === 'Activo'){
                emails.push(usuario.colaborador.correoElectronico);
            }
        });
        return emails;
    } catch (error) {
        console.log(error);
    }
}


const enviarDocumentosPorVencer = async (docs) => {
    try {
       if (docs.length > 0) {
            Handlebars.log = function () {};
            Handlebars.registerHelper('ifVencido', function(venceEn, options) {
                if (venceEn === 'Vencido') {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            });
            const emails = await obtenerAdminEmails();
            const templatePath = path.join(__dirname, '../emailTemplates/emailDocumentosTemplate.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
            const template = Handlebars.compile(htmlTemplate);
            const htmlContent = template({ documentos: docs });
            await enviarCorreo(emails, 'REPORTE DE DOCUMENTOS PRÓXIMOS A VENCER -' + fechaActual , htmlContent);
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

exports.obtenerImgCumpleanios = async (req, res) => {
    const imagePath = path.join(__dirname, '../img', 'image1.png');
    res.sendFile(imagePath);
};

exports.obtenerImg2 = async (req, res) => {
    const imagePath = path.join(__dirname, '../img', 'image2.png');
    res.sendFile(imagePath);
};