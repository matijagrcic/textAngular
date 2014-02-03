describe('taSanitize', function(){
	'use strict';
	beforeEach(module('textAngular'));
	beforeEach(module('ngSanitize'));
	describe('should change all align attributes to text-align styles for HTML5 compatability', function(){
		it('should correct left align', inject(function(taSanitize){
			var safe = angular.element(taSanitize('<div align="left"></div>'));
			expect(safe.attr('align')).not.toBeDefined();
			expect(safe.css('text-align')).toBe('left');
		}));
		it('should correct right align', inject(function(taSanitize){
			var safe = angular.element(taSanitize('<div align="right"></div>'));
			expect(safe.attr('align')).not.toBeDefined();
			expect(safe.css('text-align')).toBe('right');
		}));
		it('should correct center align', inject(function(taSanitize){
			var safe = angular.element(taSanitize('<div align=\'center\'></div>'));
			expect(safe.attr('align')).not.toBeDefined();
			expect(safe.css('text-align')).toBe('center');
		}));
		it('should correct justify align', inject(function(taSanitize){
			var safe = angular.element(taSanitize('<div align=\'justify\'></div>'));
			expect(safe.attr('align')).not.toBeDefined();
			expect(safe.css('text-align')).toBe('justify');
		}));
	});
	
	it('if invalid HTML should return the oldsafe passed in or an empty string', inject(function(taSanitize){
		var result = taSanitize('<broken><test', 'safe');
		expect(result).toBe('safe');
	}));
	
	describe('only certain style attributes are allowed', function(){
		describe('validated color attribute', function(){
			it('name', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: blue;"></div>'));
				expect(result.attr('style')).toBe('color: blue;');
			}));
			it('hex value', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: #000000;"></div>'));
				expect(result.attr('style')).toBe('color: #000000;');
			}));
			it('rgba', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: rgba(20, 20, 20, 0.5);"></div>'));
				expect(result.attr('style')).toBe('color: rgba(20, 20, 20, 0.5);');
			}));
			it('rgb', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: rgb(20, 20, 20);"></div>'));
				expect(result.attr('style')).toBe('color: rgb(20, 20, 20);');
			}));
			it('hsl', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: hsl(20, 20%, 20%);"></div>'));
				expect(result.attr('style')).toBe('color: hsl(20, 20%, 20%);');
			}));
			it('hlsa', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="color: hsla(20, 20%, 20%, 0.5);"></div>'));
				expect(result.attr('style')).toBe('color: hsla(20, 20%, 20%, 0.5);');
			}));
			it('bad value not accepted', inject(function(taSanitize){
				var result = taSanitize('<div style="color: execute(alert(\'test\'));"></div>');
				expect(result).toBe('<div></div>');
			}));
		});
		
		describe('validated text-align attribute', function(){
			it('left', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="text-align: left;"></div>'));
				expect(result.attr('style')).toBe('text-align: left;');
			}));
			it('right', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="text-align: right;"></div>'));
				expect(result.attr('style')).toBe('text-align: right;');
			}));
			it('center', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="text-align: center;"></div>'));
				expect(result.attr('style')).toBe('text-align: center;');
			}));
			it('justify', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="text-align: justify;"></div>'));
				expect(result.attr('style')).toBe('text-align: justify;');
			}));
			it('bad value not accepted', inject(function(taSanitize){
				var result = taSanitize('<div style="text-align: execute(alert(\'test\'));"></div>');
				expect(result).toBe('<div></div>');
			}));
		});
		
		describe('un-validated are removed', function(){
			it('removes non whitelisted values', inject(function(taSanitize){
				var result = taSanitize('<div style="height: 12px;"></div>');
				expect(result).toBe('<div></div>');
			}));
			it('removes non whitelisted values leaving valid values', inject(function(taSanitize){
				var result = angular.element(taSanitize('<div style="text-align: left; height: 12px;"></div>'));
				expect(result.attr('style')).toBe('text-align: left;');
			}));
		});
	});
});