import mongoose from "mongoose";

const placeholderPositionSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true,
        enum: ['studentName', 'courseName', 'teacherName', 'completionDate', 'certificateId']
    },
    x: {
        type: Number,
        required: true,
        default: 100
    },
    y: {
        type: Number,
        required: true,
        default: 100
    },
    fontSize: {
        type: Number,
        default: 24
    },
    fontFamily: {
        type: String,
        default: 'Helvetica'
    },
    fontColor: {
        type: String,
        default: '#000000'
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}, { _id: false });

const certificateSettingsSchema = new mongoose.Schema({
    // Template name for admin reference
    templateName: {
        type: String,
        default: 'Default Certificate Template'
    },

    // Background image (optional - can be used as watermark/overlay)
    backgroundImage: {
        public_id: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: ''
        }
    },

    // PDF page size
    pageSize: {
        type: String,
        enum: ['A4', 'Letter', 'Landscape_A4', 'Landscape_Letter'],
        default: 'Landscape_A4'
    },

    // Placeholder positions and styling (for reference, not used in PDFKit)
    placeholders: {
        type: [placeholderPositionSchema],
        default: [
            { fieldName: 'studentName', x: 400, y: 300, fontSize: 36, fontFamily: 'Helvetica', fontColor: '#2C3E50', isEnabled: true },
            { fieldName: 'courseName', x: 400, y: 400, fontSize: 28, fontFamily: 'Helvetica', fontColor: '#34495E', isEnabled: true },
            { fieldName: 'teacherName', x: 400, y: 480, fontSize: 20, fontFamily: 'Helvetica', fontColor: '#7F8C8D', isEnabled: true },
            { fieldName: 'completionDate', x: 400, y: 540, fontSize: 18, fontFamily: 'Helvetica', fontColor: '#95A5A6', isEnabled: true },
            { fieldName: 'certificateId', x: 400, y: 600, fontSize: 14, fontFamily: 'Courier', fontColor: '#BDC3C7', isEnabled: true }
        ]
    },

    // Organization name displayed on certificate (Fixed: MDAI)
    organizationName: {
        type: String,
        default: 'MDAI'
    },

    // Certificate title
    certificateTitle: {
        type: String,
        default: 'Certificate of Completion'
    },

    // Whether certificate system is enabled
    isEnabled: {
        type: Boolean,
        default: true
    },

    // Last updated by
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }

}, { timestamps: true });

// Ensure only one settings document exists
certificateSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const CertificateSettings = mongoose.model('CertificateSettings', certificateSettingsSchema);

export default CertificateSettings;

