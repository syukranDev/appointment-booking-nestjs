import { Controller, Get } from '@nestjs/common';
import { DatabaseConnectionService } from './database-connection.service';

@Controller('database')
export class DatabaseTestController {
  constructor(private databaseConnectionService: DatabaseConnectionService) {}

  @Get('test')
  async testConnection() {
    console.log('🧪 Manual database connection test initiated...');
    const isConnected = await this.databaseConnectionService.testConnection();
    
    if (isConnected) {
      return {
        status: 'success',
        message: 'Database connection is working!',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        status: 'error',
        message: 'Database connection failed!',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('info')
  async getConnectionInfo() {
    const info = await this.databaseConnectionService.getConnectionInfo();
    console.log('📊 Database connection info:', info);
    return info;
  }

  @Get('status')
  async getStatus() {
    try {
      const info = await this.databaseConnectionService.getConnectionInfo();
      return {
        status: 'healthy',
        database: info.database,
        host: info.host,
        port: info.port,
        connected: info.status === 'connected',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
