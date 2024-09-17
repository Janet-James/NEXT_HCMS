"""
Create the library for Asynchronous Logger function using multiprocessing
@author: Selvakumar.M
@version: 1.0
"""
import logging
import datetime
from CommonLib import config
import os
import multiprocessing as mp
import inspect
starttime = datetime.datetime.now()
logging.basicConfig(level=logging.DEBUG,
format='%(asctime)s %(levelname)-8s %(message)s',
	datefmt=config.datefmt,
	filename=config.file_path+config.filename,
	filemode='a')
logger = logging.getLogger('NEXT INC')
def log_info(log_type,message_list):
	"""
	Function for write a logger message into file
	@param log_type : Request the parameter log_type for type of log messages
	@param msg : Request the parameter msg for logging message content 
	@rtype: bool
	@return: True if successful
	"""
	try:	
		#Check the logger type and write the logger with that specific type
		if log_type == 'info':
			logging.info("FileName : %s FunctionName : %s LineNumber %i - %s" % (
		        message_list[0], 
		        message_list[1], 
		        message_list[2], 
		        message_list[3]
		    ))
		elif log_type == 'warning':
			logger.warning("FileName : %s FunctionName : %s LineNumber %i - %s" % (
		        message_list[0], 
		        message_list[1], 
		        message_list[2], 
		        message_list[3]
		    ))
		elif log_type == 'debug':
			logger.debug("FileName : %s FunctionName : %s LineNumber %i - %s" % (
		        message_list[0], 
		        message_list[1], 
		        message_list[2], 
		        message_list[3]
		    ))
		elif log_type == 'error':
			logging.error("FileName : %s FunctionName : %s LineNumber %i - %s" % (
		        message_list[0], 
		        message_list[1], 
		        message_list[2], 
		        message_list[3]
		    ))
		elif log_type == 'critical':
			logger.critical("FileName : %s FunctionName : %s LineNumber %i - %s" % (
		        message_list[0], 
		        message_list[1], 
		        message_list[2], 
		        message_list[3]
		    ))
		return True
	except Exception as e:
		logger.error(e)
		return False

class Logger():
	"""
	class for implement the asynchronous logger function implementation
	"""
	#function for write information message in logger file
	def info(self, msg):
		func = inspect.currentframe().f_back.f_code
		function_name = func.co_name 
		message_list = []
		message_list.append('/'.join(func.co_filename.rsplit('/', 2)[-2:]))
		message_list.append(func.co_name)
		message_list.append(func.co_firstlineno)
		message_list.append(msg)
		self.pool = mp.Pool(1)
 		self.pool.apply_async(log_info,args=('info',message_list))
		self.pool.close()
	#function for write warning message in logger file
	def warning(self, msg):
		func = inspect.currentframe().f_back.f_code
		function_name = func.co_name 
		message_list = []
		message_list.append('/'.join(func.co_filename.rsplit('/', 2)[-2:]))
		message_list.append(func.co_name)
		message_list.append(func.co_firstlineno)
		message_list.append(msg)
		self.pool = mp.Pool(1)
		self.pool.apply_async(log_info,args=('warning',message_list))
		self.pool.close()
	#function for write debug message in logger file
	def debug(self, msg):
		func = inspect.currentframe().f_back.f_code
		function_name = func.co_name 
		message_list = []
		message_list.append('/'.join(func.co_filename.rsplit('/', 2)[-2:]))
		message_list.append(func.co_name)
		message_list.append(func.co_firstlineno)
		message_list.append(msg)
		self.pool = mp.Pool(1)
		self.pool.apply_async(log_info,args=('debug',message_list))
		self.pool.close()
	#function for write error message in logger file
	def error(self, msg):
		func = inspect.currentframe().f_back.f_code
		function_name = func.co_name 
		message_list = []
		message_list.append('/'.join(func.co_filename.rsplit('/', 2)[-2:]))
		message_list.append(func.co_name)
		message_list.append(func.co_firstlineno)
		message_list.append(msg)
		log_info('error',message_list)
		self.pool = mp.Pool(1)
		self.pool.apply_async(log_info,args=('error',message_list))
		self.pool.close()
	#function for write critical message in logger file
	def critical(self, msg):
		func = inspect.currentframe().f_back.f_code
		function_name = func.co_name 
		message_list = []
		message_list.append('/'.join(func.co_filename.rsplit('/', 2)[-2:]))
		message_list.append(func.co_name)
		message_list.append(func.co_firstlineno)
		message_list.append(msg)
		log_info('critical',message_list)
		self.pool = mp.Pool(1)
		self.pool.apply_async(log_info,args=('critical',message_list))
		self.pool.close()

logger_obj = Logger()