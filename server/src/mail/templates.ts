export const getLicenseExpiryTemplate = (driverName: string, licenseNumber: string, expiryDate: string): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; }
    .header { background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; }
    .content { margin: 20px 0; }
    .footer { font-size: 0.8em; color: #777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>TransitOps Warning Alert</h2>
    </div>
    <div class="content">
      <p>Hello safety officer,</p>
      <p>This is to inform you that driver <strong>${driverName}</strong>'s license (License Number: <strong>${licenseNumber}</strong>) is expiring soon.</p>
      <p>Expiry Date: <strong>${expiryDate}</strong></p>
      <p>Please take action to verify renewal options before dispatch scheduling is blocked.</p>
    </div>
    <div class="footer">
      <p>This is an automated system notification from TransitOps Smart Transport Operations Platform.</p>
    </div>
  </div>
</body>
</html>
`;

export const getInsuranceExpiryTemplate = (registrationNumber: string, vehicleName: string, expiryDate: string): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; }
    .header { background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; }
    .content { margin: 20px 0; }
    .footer { font-size: 0.8em; color: #777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>TransitOps Maintenance Alert</h2>
    </div>
    <div class="content">
      <p>Hello fleet manager,</p>
      <p>This is to inform you that vehicle <strong>${vehicleName}</strong> (Registration: <strong>${registrationNumber}</strong>)'s insurance is expiring soon.</p>
      <p>Expiry Date: <strong>${expiryDate}</strong></p>
      <p>Please make sure to renew insurance to prevent vehicle downtime or legal issues.</p>
    </div>
    <div class="footer">
      <p>This is an automated system notification from TransitOps Smart Transport Operations Platform.</p>
    </div>
  </div>
</body>
</html>
`;
